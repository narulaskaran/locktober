import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LoadingLine } from "@/components/loading-line";
import { PumpkinPatch } from "@/components/pumpkin";
import { Wordmark } from "@/components/wordmark";
import { fill } from "@/lib/copy";
import { formatRange, fromDbDate } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { btnEmber, btnGhost, card } from "@/lib/styles";
import { joinChallenge } from "@/server/actions";
import { getVoice } from "@/lib/voice";

export async function generateMetadata(): Promise<Metadata> {
  const { copy } = await getVoice();
  return {
    title: copy.join.invited,
    robots: { index: false, follow: false },
  };
}

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  return (
    <Suspense fallback={<LoadingLine page="invite" className="px-5 py-8 text-sm text-ink-soft" />}>
      <Join params={params} />
    </Suspense>
  );
}

async function Join({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { copy } = await getVoice();
  const challenge = await prisma.challenge.findUnique({
    where: { inviteCode: code },
    include: {
      metrics: { orderBy: { sortOrder: "asc" } },
      _count: { select: { members: true } },
    },
  });
  if (!challenge) notFound();

  const { userId } = await auth();
  const already =
    userId === null
      ? false
      : Boolean(
          await prisma.challengeMember.findUnique({
            where: { challengeId_userId: { challengeId: challenge.id, userId } },
          }),
        );

  const start = fromDbDate(challenge.startDate);
  const end = fromDbDate(challenge.endDate);
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(`/join/${code}`)}`;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-8">
      <Wordmark />
      <p className="mt-10 text-xs font-medium uppercase tracking-[0.16em] text-ember">
        {copy.join.invite}
      </p>
      <h1 className="mt-3 font-serif text-5xl leading-[0.95]">{challenge.name}</h1>
      <p className="mt-3 text-sm text-ink-soft">
        {formatRange(start, end)} ·{" "}
        {fill(copy.join.already, {
          count: fill(challenge._count.members === 1 ? copy.person : copy.people, {
            count: challenge._count.members,
          }),
        })}
      </p>
      <ul className={`${card} mt-6 p-4 text-sm`}>
        {challenge.metrics.map((metric) => (
          <li key={metric.id} className="flex justify-between gap-3 border-b border-line py-2 last:border-0">
            <span>{metric.name}</span>
            <span className="text-ink-soft">
              {metric.kind === "DAILY" ? copy.kind.daily : copy.kind.finale}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {already ? (
          <Link href={`/c/${challenge.slug}`} className={btnEmber}>
            {copy.join.open}
          </Link>
        ) : userId ? (
          <form action={joinChallenge}>
            <input type="hidden" name="code" value={code} />
            <button className={btnEmber} type="submit">
              {copy.join.join}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={signInHref} className={btnEmber}>
              {copy.join.signIn}
            </Link>
            <Link href={`/sign-up?redirect_url=${encodeURIComponent(`/join/${code}`)}`} className={btnGhost}>
              {copy.join.account}
            </Link>
          </div>
        )}
      </div>
      <div className="mt-auto flex justify-end pt-12" aria-hidden="true">
        <PumpkinPatch compact />
      </div>
    </main>
  );
}
