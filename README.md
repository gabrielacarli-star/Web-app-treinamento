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
the product content on the checkout platform. It points at the URL in
`ACCESS_URL` inside `assets/build-access-guide.py` — update that constant and
re-run the script after the production domain is settled.

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

To fill a slot, replace the `<ImageSlot>` or `<VideoSlot>` element with the real
asset. The slots keep a fixed aspect ratio, so nothing below them shifts.
