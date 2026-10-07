import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { ChallengeTabs } from "@/components/tabs";
import { Wordmark } from "@/components/wordmark";
import { getChallengeContext } from "@/lib/challenges";
import { fill } from "@/lib/copy";
import { boardProgress, formatRange, progressLabel, todayISO } from "@/lib/dates";
import { getVoice } from "@/lib/voice";

export default function ChallengeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl px-5 py-5">
      <Wordmark href="/home" />
      <Suspense fallback={<HeaderSkeleton />}>
        <ChallengeHeader params={params} />
      </Suspense>
      <div className="pb-24 md:pb-10">{children}</div>
    </div>
  );
}

async function ChallengeHeader({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { copy } = await getVoice();
  const { challenge, members } = await getChallengeContext(slug);
  await connection();
  const progress = boardProgress(
    challenge.startDate,
    challenge.endDate,
    todayISO(challenge.timezone),
  );
  return (
    <header className="mt-8">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft">
        <span className={progress.state === "live" ? "text-ember" : undefined}>
          {progressLabel(progress, copy.header)}
        </span>{" "}
        · {formatRange(challenge.startDate, challenge.endDate)} ·{" "}
        {fill(members.length === 1 ? copy.person : copy.people, { count: members.length })}
      </p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <h1 className="font-serif text-5xl leading-[0.95]">{challenge.name}</h1>
        <Link href="/home" className="mb-1 shrink-0 text-sm underline">
          {copy.header.allBoards}
        </Link>
      </div>
      {progress.state === "live" ? (
        <div
          className="mt-3 h-1 bg-line"
          role="progressbar"
          aria-label={copy.header.elapsed}
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-valuenow={progress.day}
        >
          <div className="h-full bg-ember" style={{ width: `${(progress.day / progress.total) * 100}%` }} />
        </div>
      ) : null}
      <Suspense fallback={<div className="mt-6 h-14 bg-line md:h-10 md:w-80" />}>
        <ChallengeTabs slug={slug} />
      </Suspense>
    </header>
  );
}

function HeaderSkeleton() {
  return (
    <div className="mt-8">
      <div className="h-3 w-40 bg-line" />
      <div className="mt-3 h-12 w-64 bg-line" />
      <div className="mt-6 h-12 bg-line md:w-80" />
    </div>
  );
}
