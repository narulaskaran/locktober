import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Wordmark } from "@/components/wordmark";
import { formatRange, fromDbDate } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { btnEmber, btnGhost, card } from "@/lib/styles";
import { joinChallenge } from "@/server/actions";

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  return (
    <Suspense fallback={<p className="px-5 py-8 text-sm text-ink-soft">Opening the invite…</p>}>
      <Join params={params} />
    </Suspense>
  );
}

async function Join({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
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
      <p className="mt-10 text-xs font-medium uppercase tracking-[0.16em] text-ember">Invite</p>
      <h1 className="mt-3 font-serif text-5xl leading-[0.95]">{challenge.name}</h1>
      <p className="mt-3 text-sm text-ink-soft">
        {formatRange(start, end)} · {challenge._count.members}{" "}
        {challenge._count.members === 1 ? "person" : "people"} already on it
      </p>
      <ul className={`${card} mt-6 p-4 text-sm`}>
        {challenge.metrics.map((metric) => (
          <li key={metric.id} className="flex justify-between gap-3 border-b border-line py-2 last:border-0">
            <span>{metric.name}</span>
            <span className="text-ink-soft">{metric.kind === "DAILY" ? "Daily" : "Finale"}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {already ? (
          <Link href={`/c/${challenge.slug}`} className={btnEmber}>
            Open the board
          </Link>
        ) : userId ? (
          <form action={joinChallenge}>
            <input type="hidden" name="code" value={code} />
            <button className={btnEmber} type="submit">
              Join this board
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={signInHref} className={btnEmber}>
              Sign in to join
            </Link>
            <Link href={`/sign-up?redirect_url=${encodeURIComponent(`/join/${code}`)}`} className={btnGhost}>
              Make an account
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
