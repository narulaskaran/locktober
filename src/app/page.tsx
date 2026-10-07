import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Suspense } from "react";
import { Wordmark } from "@/components/wordmark";
import { fill } from "@/lib/copy";
import { btnEmber, btnGhost, card } from "@/lib/styles";
import { getVoice } from "@/lib/voice";

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Landing />
    </Suspense>
  );
}

async function Landing() {
  const { copy } = await getVoice();
  const sample = [
    { rank: "1", name: copy.landing.sampleName1, today: "180", month: "2,410" },
    { rank: "2", name: copy.landing.sampleName2, today: "150", month: "2,105" },
    { rank: "3", name: copy.landing.sampleName3, today: "90", month: "1,640" },
  ];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-5 sm:px-8">
      <header className="flex items-center justify-between gap-4">
        <Wordmark />
        <Suspense fallback={<span className="h-11 w-28 border border-transparent" />}>
          <AccountLink boards={copy.landing.yourBoards} signIn={copy.landing.signIn} />
        </Suspense>
      </header>

      <main className="grid items-center gap-12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-ember">
            {copy.landing.kicker}
          </p>
          <h1 className="mt-4 max-w-xl font-serif text-6xl leading-[0.9] tracking-tight sm:text-8xl">
            {copy.landing.hero}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            {copy.landing.lede}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/challenges/new" className={btnEmber}>
              {copy.landing.start}
            </Link>
            <Link href="/sign-in" className={btnGhost}>
              {copy.landing.signIn}
            </Link>
          </div>
          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            <div>
              <dt className="font-serif text-2xl">{copy.landing.today}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{copy.landing.todayBlurb}</dd>
            </div>
            <div>
              <dt className="font-serif text-2xl">{copy.landing.month}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{copy.landing.monthBlurb}</dd>
            </div>
            <div>
              <dt className="font-serif text-2xl">{copy.landing.finale}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{copy.landing.finaleBlurb}</dd>
            </div>
          </dl>
        </div>

        <aside className={`${card} p-4 sm:p-5`} aria-label={copy.landing.sampleLabel}>
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft">
              {copy.landing.sampleLabel}
            </p>
            <p className="font-serif text-xl italic">{copy.landing.sampleMetric}</p>
          </div>
          <ol className="mt-4 border-t border-ink">
            {sample.map((row) => (
              <li key={row.name} className="flex items-center gap-3 border-b border-line py-3">
                <span className="w-5 font-serif text-ink-soft">{row.rank}</span>
                <span className="flex-1 font-medium">{row.name}</span>
                <span className="text-right">
                  <span className="block font-serif text-3xl leading-none">{row.today}</span>
                  <span className="text-xs text-ink-soft">
                    {fill(copy.thisMonth, { amount: row.month })}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-ink-soft">{copy.landing.sampleNote}</p>
        </aside>
      </main>
    </div>
  );
}

async function AccountLink({ boards, signIn }: { boards: string; signIn: string }) {
  const { userId } = await auth();
  if (userId) {
    return (
      <Link href="/home" className={btnInkLink}>
        {boards}
      </Link>
    );
  }
  return (
    <Link href="/sign-in" className={btnInkLink}>
      {signIn}
    </Link>
  );
}

const btnInkLink =
  "inline-flex min-h-11 items-center border border-ink bg-ink px-4 text-sm font-medium text-paper";
