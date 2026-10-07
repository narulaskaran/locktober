import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import { Wordmark } from "@/components/wordmark";
import { loadHome } from "@/lib/challenges";
import { formatRange } from "@/lib/dates";
import { formatValue } from "@/lib/format";
import { btnEmber, btnGhost, card } from "@/lib/styles";

const notices: Record<string, string> = {
  "not-on-board": "That board is private. Ask for an invite link.",
  "bad-invite": "That invite link doesn't match a board.",
};

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <Home searchParams={searchParams} />
    </Suspense>
  );
}

async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const noticeKey = typeof params.notice === "string" ? params.notice : "";
  const notice = notices[noticeKey];
  const { cards } = await loadHome();

  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl px-5 py-5">
      <header className="flex items-center justify-between gap-4">
        <Wordmark href="/home" />
        <UserButton />
      </header>
      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl leading-none">Your boards</h1>
          <p className="mt-2 text-sm text-ink-soft">The challenges you own or were invited to.</p>
        </div>
        <Link href="/challenges/new" className={btnEmber}>
          New
        </Link>
      </div>
      {notice ? (
        <p className="mt-6 border border-ink bg-paper-2 px-3 py-2 text-sm" role="status">
          {notice}
        </p>
      ) : null}
      {cards.length === 0 ? (
        <div className={`${card} mt-8 p-5`}>
          <h2 className="font-serif text-3xl">Nothing here yet.</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Start a board and send the link, or open an invite from a friend.
          </p>
          <Link href="/challenges/new" className={`${btnGhost} mt-5`}>
            Start a board
          </Link>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-4">
          {cards.map((cardItem) => (
            <li key={cardItem.slug}>
              <Link href={`/c/${cardItem.slug}`} className={`${card} block p-4 hover:bg-white`}>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-serif text-3xl leading-none">{cardItem.name}</h2>
                  <span className="text-xs uppercase tracking-[0.14em] text-ink-soft">
                    {cardItem.members} {cardItem.members === 1 ? "person" : "people"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-soft">
                  {formatRange(cardItem.start, cardItem.end)}
                </p>
                {cardItem.metricName ? (
                  <div className="mt-4 flex items-end justify-between gap-4 border-t border-line pt-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">Today</p>
                      <p className="font-serif text-4xl leading-none">
                        {cardItem.todayValue === null ? (
                          <span className="text-ink-soft">—</span>
                        ) : (
                          formatValue(cardItem.todayValue, cardItem.metricInput)
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
                        {cardItem.metricName} this month
                      </p>
                      <p className="font-serif text-2xl leading-none">
                        {formatValue(cardItem.monthTotal, cardItem.metricInput)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-ink-soft">No daily tracker yet.</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-2xl px-5 py-5">
      <div className="h-8 w-32 bg-line" />
      <div className="mt-10 h-12 w-56 bg-line" />
      <div className="mt-8 h-36 border border-line bg-paper-2" />
    </div>
  );
}
