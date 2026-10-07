import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Suspense } from "react";
import { Wordmark } from "@/components/wordmark";
import { btnEmber, btnGhost, card } from "@/lib/styles";

const sample = [
  { rank: "1", name: "Sam", today: "180", month: "2,410" },
  { rank: "2", name: "Alex", today: "150", month: "2,105" },
  { rank: "3", name: "Jules", today: "90", month: "1,640" },
];

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-5 sm:px-8">
      <header className="flex items-center justify-between gap-4">
        <Wordmark />
        <Suspense fallback={<span className="h-11 w-28 border border-transparent" />}>
          <AccountLink />
        </Suspense>
      </header>

      <main className="grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-ember">
            October, locked in
          </p>
          <h1 className="mt-4 max-w-xl font-serif text-6xl leading-[0.9] tracking-tight sm:text-8xl">
            A month on the board.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Loctober is a private scoreboard for the people you actually train with.
            Log the day, watch the month add up, and settle it with one finale.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/challenges/new" className={btnEmber}>
              Start a board
            </Link>
            <Link href="/sign-in" className={btnGhost}>
              Sign in
            </Link>
          </div>
          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            <div>
              <dt className="font-serif text-2xl">Today</dt>
              <dd className="mt-1 text-sm text-ink-soft">Who showed up, and for how many.</dd>
            </div>
            <div>
              <dt className="font-serif text-2xl">The month</dt>
              <dd className="mt-1 text-sm text-ink-soft">Volume, stacked, with the days you missed left blank.</dd>
            </div>
            <div>
              <dt className="font-serif text-2xl">The last day</dt>
              <dd className="mt-1 text-sm text-ink-soft">One max effort. Or the whole presidential test.</dd>
            </div>
          </dl>
        </div>

        <aside className={`${card} p-4 sm:p-5`} aria-label="Sample board">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft">Sample board</p>
            <p className="font-serif text-xl italic">Push-ups</p>
          </div>
          <ol className="mt-4 border-t border-ink">
            {sample.map((row) => (
              <li key={row.name} className="flex items-center gap-3 border-b border-line py-3">
                <span className="w-5 font-serif text-ink-soft">{row.rank}</span>
                <span className="flex-1 font-medium">{row.name}</span>
                <span className="text-right">
                  <span className="block font-serif text-3xl leading-none">{row.today}</span>
                  <span className="text-xs text-ink-soft">{row.month} this month</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-ink-soft">
            Boards are invite-only. Send a link, they sign in with Google, and they can log.
            Strangers cannot.
          </p>
        </aside>
      </main>
    </div>
  );
}

async function AccountLink() {
  const { userId } = await auth();
  if (userId) {
    return (
      <Link href="/home" className={btnInkLink}>
        Your boards
      </Link>
    );
  }
  return (
    <Link href="/sign-in" className={btnInkLink}>
      Sign in
    </Link>
  );
}

const btnInkLink =
  "inline-flex min-h-11 items-center border border-ink bg-ink px-4 text-sm font-medium text-paper";
