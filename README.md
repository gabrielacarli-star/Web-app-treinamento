# DogFlow

Quiz funnel for a dog-training offer, built to be validated with paid traffic
before any video is produced. Every video and image slot in the funnel is a
placeholder with a stable id, so creative can be dropped in later without
touching layout.

Stack: Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS.
Ships as static pages — deploys to Vercel with no configuration.

## The funnel

| Route | Screen |
| --- | --- |
| `/[locale]` | Landing, one headline variant per ad angle |
| `/[locale]/quiz` | 19-step quiz in three blocks |
| `/[locale]/prediction` | "today → goal" forecast chart |
| `/[locale]/building` | Plan-building loader with progress bars |
| `/[locale]/plan` | Plan ready + training profile |
| `/[locale]/email` | E-mail capture, then the marketing opt-in |
| `/[locale]/discount` | Scratch-card welcome discount |
| `/[locale]/offer` | Paywall: countdown, coupon, three plans, FAQ |
| `/[locale]/success` | Post-checkout confirmation |
| `/[locale]/app` | Member-area preview with video slots |

Locales: `pt` (default), `es`, `en` — each one is prerendered.

## Local development

```bash
npm install
npm run dev     # http://localhost:3000/pt
```

## Deploying to Vercel

Import the repository and deploy. No build settings to change: Vercel detects
Next.js on its own. Then set the environment variables below under
**Settings → Environment Variables** and redeploy.

**Set the project name to `dogflow` on the import screen.** The free domain is
derived from the Vercel project name, not from the GitHub repository name, and
Vercel pre-fills it from the repo. Left as-is it yields
`web-app-treinamento.vercel.app`; changed to `dogflow` it yields
`dogflow.vercel.app`, which is what the buyer-facing access guide points at. It
can also be changed later under **Settings → General → Project Name**, but the
domain changes with it, so any link already handed out breaks.

## Environment variables

Copy `.env.example` to `.env.local` for local runs. All of them are optional —
the funnel is fully walkable with none of them set.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CURRENCY` | Currency label on the paywall (display only) |
| `NEXT_PUBLIC_CHECKOUT_P7` | Checkout URL for the 7-day plan |
| `NEXT_PUBLIC_CHECKOUT_P4` | Checkout URL for the 4-week plan |
| `NEXT_PUBLIC_CHECKOUT_P12` | Checkout URL for the 12-week plan |
| `NEXT_PUBLIC_LEAD_WEBHOOK` | Receives the captured e-mail plus every quiz answer |

Unset checkout URLs send the visitor to `/[locale]/success` instead, which is
what you want while the offer is still being validated. When a URL is set, the
buyer's `email`, `coupon` and `plan` are appended as query parameters so the
order can be matched back to the funnel run.

## Testing ad angles

Each landing headline is a variant with its own id. Point one ad at each:

```
/pt?v=leash        Walk with no leash pulling in 1 day
/pt?v=potty        Potty trained in the right spot in 3 days
/pt?v=biting       Stop the play biting in 3 hours
/pt?v=behaviour    Cut the unwanted behaviour in 2 days
/pt?v=alone        Puppy home alone, drama free, in 5 hours
```

The chosen variant is stored with the run and posted to the lead webhook, so
conversion can be split by angle. An unknown or missing `v` falls back to the
first variant.

## Where to change things

| What | File |
| --- | --- |
| Brand name, prices, discount, countdown length | `src/lib/config.ts` |
| Quiz structure, step order, conditional steps | `src/lib/quiz.ts` |
| All copy, per language | `src/content/pt.ts`, `es.ts`, `en.ts` |
| Colours and shared styles | `tailwind.config.ts`, `src/app/globals.css` |

Quiz structure and quiz copy are deliberately separate: `quiz.ts` holds step
ids and logic, and each locale file supplies the strings for those ids. Adding
a language means adding one file, never touching the flow.

Copy interpolates `{dog}`, `{breed}` and `{date}` from the visitor's own
answers. When the dog's name is skipped it falls back to `common.yourDog`.

## Creative slots

Every placeholder carries a `data-slot` id, shown on the placeholder itself:

- `hero-<variant>` — landing image, one per ad angle
- `quiz-proof_breed`, `quiz-heard_you` — mid-quiz interstitials
- `plan-ready` — plan-ready screen
- `lesson-<course>-<lesson>` — member-area lesson videos

The illustrations are drawn, not generated: `assets/build-art.py` emits the
SVG in `assets/art-svg/`, which renders to the PNGs in `public/art/`. They use
the funnel's own palette and share one parameterised dog, so the set reads as
one brand. Backgrounds are transparent, so the art sits on whatever surface the
page uses.

Only the lesson videos are still placeholders. `PROMPTS.md` holds a
ready-to-paste generation prompt for those, plus photo alternatives for any
illustration you want to A/B against.

## Buyer-facing files

`assets/DogFlow-Guia-de-Acceso.pdf` is the Spanish access guide delivered as
the product content on the checkout platform. Regenerate it with:

```
python3 assets/build-access-guide.py https://<real-domain>.vercel.app/es/app
```

The URL is a required argument, not a stored constant: this file is what a
real buyer downloads after paying, so the script refuses to run without one
rather than risk quietly reusing a stale or wrong domain. It must point at
`/es/app` (the member area — the login screen if the buyer isn't signed in
yet), not the bare locale root, which is the quiz landing page and would
send a paying customer back through the quiz instead of into their course.

**Before pointing any live traffic at this offer**, confirm the production
domain in three places: this PDF, the thank-you-page URL set on each of the
three Hotmart offers, and any ad pointing at the funnel. A `.vercel.app`
subdomain is global across all Vercel accounts, not reserved per project —
a short name like `dogflow` can already belong to someone else, so verify the
actual assigned domain in the Vercel dashboard rather than assuming it.

## Access control

The member area is gated as soon as `NEXT_PUBLIC_SUPABASE_URL` is set. Without
it the app runs exactly as before, open at `/[locale]/app`, so the funnel stays
walkable before Supabase is configured.

The flow:

1. The buyer pays on the checkout platform.
2. The platform posts to `/api/webhooks/hotmart`, which verifies the `hottok`,
   records the raw delivery, and writes a row in `purchases` keyed by the
   buyer's e-mail.
3. The buyer opens `/[locale]/login`, enters that same e-mail and receives a
   magic link. No password exists to be forgotten or leaked.
4. `/[locale]/app` requires both a session and a purchase that is `active` and
   not past `expires_at`. Anything else redirects to the login or shows the
   "no purchase found" screen.

Refunds, chargebacks and cancellations arrive as webhook events too and flip
the row's status, which revokes access on the buyer's next request.

E-mail is the join key because it is the only stable identifier the checkout
platform and the login have in common. A buyer who pays with one address and
signs in with another will not be recognised — the login screen says so, and
the guide tells them to use the purchase e-mail.

### Schema

`supabase/migrations/` holds the SQL as applied. Two tables:

- `purchases` — RLS on. A signed-in user can read only rows whose `email`
  matches their own JWT claim. There is no insert, update or delete policy at
  all, so writes are possible only with the service-role key.
- `webhook_events` — every delivery stored verbatim before it is interpreted.
  RLS on with no policies, so it is service-role only. This is what makes a
  mis-parsed payload recoverable.

Verified by simulating each caller in Postgres: anonymous sees zero rows, a
signed-in user with a different e-mail sees zero, and the buyer sees their own.

### Webhook payload shape

The checkout platform's payload varies by version and event, and its developer
docs were unreachable from the build environment, so the handler reads the
e-mail, transaction, product and offer from several candidate paths rather than
one hardcoded shape. **Check `webhook_events` after the first real sale** and
tighten the paths to match what actually arrives.

## Abandoned-lead recovery emails

`src/app/api/cron/recover-leads/route.ts` fires on a schedule (`vercel.json`
sets it hourly) and emails anyone who left their address in the quiz
(`quiz_leads.email` set) but has no `purchases` row with `status = 'active'`
one hour later. Each lead is only ever emailed once —
`quiz_leads.recovery_email_sent_at` is stamped on send and the query skips
rows where it is already set.

Required environment variables:

- `RESEND_API_KEY` — from a [Resend](https://resend.com) account. The free
  tier covers this comfortably.
- `RESEND_FROM_EMAIL` — e.g. `DogFlow <hello@yourdomain.com>`. Sending from a
  domain you have not verified in Resend either fails or lands in spam;
  verifying one requires DNS access to a domain you own (a `.vercel.app`
  subdomain will not work for this). Until a domain is verified, Resend's
  shared `onboarding@resend.dev` sender works for low-volume testing only.
- `RESEND_REPLY_TO` — optional, defaults to `eduardosnl1997@gmail.com` (the
  same address the buyer access-guide PDF already uses). The `from` address
  needs a verified-domain mailbox that usually is not a real inbox anyone
  checks, so replies are routed here instead via Resend's `reply_to`.
- `CRON_SECRET` — any random string. When set, the route only accepts
  requests carrying `Authorization: Bearer <CRON_SECRET>`. Vercel Cron adds
  this header automatically whenever a variable named exactly `CRON_SECRET`
  exists in the project's environment — no extra wiring needed.

**Vercel's Hobby (free) plan limits cron jobs to once per day**, not hourly —
if that is the current plan, either upgrade to Pro for the hourly schedule in
`vercel.json` to actually run hourly, or point an external scheduler (e.g.
[cron-job.org](https://cron-job.org), free) at
`POST https://<your-domain>/api/cron/recover-leads` with an
`Authorization: Bearer <CRON_SECRET>` header instead.

To fill a slot, replace the `<ImageSlot>` or `<VideoSlot>` element with the real
asset. The slots keep a fixed aspect ratio, so nothing below them shifts.

## Ad spend × revenue × ROAS

The funnel already captured UTMs into `quiz_leads` and recorded every sale in
`purchases`, but neither knew about the other, and neither knew what the ad
actually cost — so there was no way to tell whether a campaign was profitable.
This adds only that missing link; nothing about the existing quiz tracking,
webhooks, or checkout flow changes.

```
ad (Meta) ──URL with utm_campaign/utm_content──► landing (captures + stores locally)
                                                        │
                                         quiz ──[/api/track]──► quiz_leads (utm_* columns)
                                                        │
                                     offer ──buy──► checkout URL, ad UTMs packed into `src`
                                                        │
                                   Hotmart/Stripe ──[webhook]──► purchases (amount_cents, campaign_id)
                                                                       │ falls back to quiz_leads
                                                                       │ by e-mail when the gateway
                                                                       │ payload carries no tracking
GET /api/cron/sync-meta ──► Meta Marketing API ──► ad_insights ────────┴──► /api/metrics/summary ──► /admin/trafego
```

### Configurar

1. Rode a migration nova: `supabase/migrations/0003_ad_attribution.sql`
   (via `supabase db push`, ou cole no SQL editor do dashboard). Só adiciona
   colunas e uma tabela nova — não altera nada existente.
2. **Parâmetros de URL do anúncio** — pra o gasto casar com a venda por
   campanha, o campo "Parâmetros de URL" do anúncio na Meta precisa incluir
   os ids, não só o nome:
   ```
   utm_campaign={{campaign.name}}|{{campaign.id}}&utm_content={{ad.name}}|{{ad.id}}
   ```
   Sem isso, a venda ainda aparece como tráfego "meta" (via `fbclid`), mas
   cai em "Sem atribuição" por falta do id da campanha.
3. **Meta Marketing API** — gere um token de sistema com permissão
   `ads_read` e preencha `META_ACCESS_TOKEN`/`META_AD_ACCOUNT_ID` (sem o
   prefixo `act_`).
4. **Segredos** — reaproveita o `CRON_SECRET` que já protege
   `/api/cron/recover-leads`; `ADMIN_SECRET` é novo, é a senha de acesso ao
   painel em `/admin/trafego`.
5. `vercel.json` já agenda `sync-meta` a cada 6h. **O plano Hobby da Vercel
   limita cron a 2 jobs e a 1x/dia** — com os dois crons existentes, esse é
   o terceiro; se o deploy recusar por causa do limite, aponte um cron
   externo (ex. [cron-job.org](https://cron-job.org)) para
   `GET /api/cron/sync-meta?days=3` com o header
   `Authorization: Bearer <CRON_SECRET>`.

Vendas registradas antes desta migration não têm `amount_cents`/`campaign_id`
até o backfill abaixo rodar.

### Trazer o histórico (vendas e gasto de antes de hoje)

**Vendas antigas** — não precisa de nenhuma credencial nova: toda compra já
tem o payload bruto do webhook salvo em `raw` (Hotmart) ou o Event do Stripe
(Stripe). `/api/admin/backfill-purchases` relê esse `raw` de cada venda com
`amount_cents` vazio e preenche valor + atribuição, do mesmo jeito que o
webhook ao vivo já faz daqui pra frente. Idempotente — chame quantas vezes
precisar, cada chamada processa até 500 linhas:

```
GET /api/admin/backfill-purchases
    header: x-admin-secret: <ADMIN_SECRET>
```

`"done": true` na resposta quer dizer que não sobrou nenhuma venda sem
valor preenchido.

**Gasto antigo do Meta** — `/api/cron/sync-meta` aceita `since`/`until`
explícitos pra sincronizar qualquer período, em fatias de até 31 dias por
chamada:

```
GET /api/cron/sync-meta?since=2020-01-01&until=2026-09-10
    header: Authorization: Bearer <CRON_SECRET>
```

Repita com `since=<nextSince>` (do JSON de resposta) até `"done": true`.

Um detalhe sobre atribuição retroativa: pra vendas Hotmart, o valor e a
campanha vêm direto do `raw` salvo (preciso). Pra vendas Stripe, o Checkout
nunca carregou UTM nenhum — a campanha, quando existe, vem de um cruzamento
por e-mail com `quiz_leads` (o mesmo fallback que o webhook ao vivo usa), o
que só funciona se o comprador deixou o e-mail no quiz. Sem isso, a venda
entra certa em valor mas cai em "Sem atribuição".
