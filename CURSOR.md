# Locktober

Private fitness challenge boards. See `README.md` for what the product does and `AGENTS.md` for how to change it.

## Layout

- `src/app` — routes. Public landing and join. Everything else is signed in.
- `src/components` — score form, invite link, rank list, crew forms
- `src/lib` — Prisma client, dates, templates, challenge reads
- `src/server/actions.ts` — writes
- `src/proxy.ts` — Clerk
- `prisma/schema.prisma` — database

Stack: Next.js, Tailwind, Prisma, Neon, Clerk, Vercel.

Do not commit `.env*`, `.vercel`, or `src/generated`. `.env.example` is the exception.
