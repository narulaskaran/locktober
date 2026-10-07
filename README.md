# Locktober

A private scoreboard for a month-long lock-in. You and your people log the daily work, watch the month add up, and close it with one finale — a max set, or the presidential test.

Boards are invite-only. Someone makes a challenge, sends a link, and friends sign in with Google (or email) through [Clerk](https://clerk.com) to join. Strangers do not get a way to post numbers on your board.

## What a board tracks

- **Today.** A leaderboard for the day you pick, including days you still need to backfill. Do your push-ups in sets and tap "Add" to stack them onto the day's total.
- **Month.** A running-total chart per person, crew and personal stats, and a strip of which days each person logged.
- **Finale.** One score per event. Higher wins, except timed events, where lower wins.
- **Crew.** The invite link (with a native share sheet on phones), nicknames, and extra trackers (steps, miles, pull-ups, whatever you add).

It installs to a phone home screen: open the site, then Share, then Add to Home Screen.

New boards start from a template: push-up month, a broader daily grind, or a presidential-style finale. The owner can add or remove trackers later.

## Stack

Next.js, Tailwind, Prisma, Neon Postgres, Clerk, and Vercel.

## Local development

```bash
pnpm install
```

Copy `.env.example` to `.env.local` and fill in `DATABASE_URL`, `DIRECT_URL`, and the Clerk keys. Then:

```bash
pnpm db:migrate
pnpm dev
```

Open http://localhost:3000.

`DATABASE_URL` is what the app uses. `DIRECT_URL` is what Prisma migrations use. On Neon, point the first at the pooled host and the second at the direct host. Locally they can be the same database.

## Scripts

- `pnpm dev` — local server
- `pnpm db:migrate` — create a dev migration
- `pnpm db:deploy` — apply migrations (production)
- `pnpm build` — generate the Prisma client and build
- `pnpm lint` — eslint
