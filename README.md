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

`PROMPTS.md` holds a ready-to-paste generation prompt for each one.

To fill a slot, replace the `<ImageSlot>` or `<VideoSlot>` element with the real
asset. The slots keep a fixed aspect ratio, so nothing below them shifts.
