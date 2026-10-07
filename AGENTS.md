<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Loctober

Private multi-tenant fitness boards. One repo, one Next.js app. Friends join a challenge with an invite link after signing in with Clerk. They cannot see boards they were not invited to.

## Map

- `src/app/page.tsx` — public landing
- `src/app/home/page.tsx` — boards for the signed-in user
- `src/app/challenges/new/page.tsx` — create a board
- `src/app/c/[slug]/` — today, `month`, `finale`, `crew`
- `src/app/join/[code]/page.tsx` — public invite preview and join
- `src/proxy.ts` — Clerk session on each request. Pages and actions decide who can see a board
- `src/server/actions.ts` — mutations. Every one checks membership
- `src/lib/challenges.ts` — reads. `getChallengeContext` redirects non-members home
- `src/lib/templates.ts` — starting trackers. Add a template here
- `src/components/score-form.tsx`, `log-sheet.tsx` — the logging UI. Daily logs offer "Add to today" or "Set total"; finale scores always replace
- `src/components/month-chart.tsx` — server-rendered SVG running totals. Colors come from `src/lib/palette.ts`
- `src/app/manifest.ts`, `public/icon-*.png`, `src/app/apple-icon.png` — home-screen install
- `prisma/schema.prisma` — User, Challenge, ChallengeMember, Metric, Entry, FinaleEntry

Daily logs live on `Entry` (one value per person, metric, and calendar date). Finale scores live on `FinaleEntry` (one value per person and metric). `Metric.kind` is `DAILY` or `FINALE`. `Metric.input` is `COUNT`, `DECIMAL`, or `DURATION` (seconds). Timed metrics rank lower-is-better.

“Today” uses the challenge timezone, not the server timezone. Calendar dates are stored as Postgres `date` and passed around as `YYYY-MM-DD`.

## Auth and access

Clerk identifies the person. The Prisma `User.id` is the Clerk user id, upserted on each authenticated read. Google and email are both enabled on the Clerk instance.

Do not add a public write path. Invite codes are the only way onto a board. Joining requires a signed-in user. Owners can rotate the code, which kills the old link.

## Next.js 16

`cacheComponents` is on. Anything that reads cookies, Clerk, the current time, or the database has to sit inside `<Suspense>`. Call `await connection()` from `next/server` before `new Date()`. `src/proxy.ts` runs Clerk (`proxy`, not `middleware`). `requireUser` sends anonymous visitors to sign-in. `getChallengeContext` and the server actions check board membership.

## Commands

```bash
pnpm dev
pnpm db:migrate
pnpm db:deploy
pnpm lint
pnpm build
```

## Env

`.env.local` is gitignored. See `.env.example`. Never commit keys, database URLs, or real personal data. Use placeholder names in fixtures.

`DATABASE_URL` — app runtime (Neon pooled URL in production).
`DIRECT_URL` — Prisma migrations (Neon direct URL). Falls back to `DATABASE_URL`.

## UI

The visual system is paper, ink, and one ember accent. It is defined in `src/app/globals.css` and `src/lib/styles.ts`. Keep new screens on those tokens. Touch targets stay at least 44px. The challenge tabs are fixed to the bottom on small screens.

Global element resets go inside `@layer base` in `globals.css`. An unlayered rule beats every Tailwind utility, which is how `font: inherit` once silently overrode `text-sm` and `text-5xl` on all inputs and buttons. Number entry is a text input with `inputMode`, not `type="number"`, so the field can be empty and never shows "075".
