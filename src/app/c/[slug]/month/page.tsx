import Link from "next/link";
import { Suspense } from "react";
import { LoadingLine } from "@/components/loading-line";
import { Pumpkin } from "@/components/pumpkin";
import { getChallengeContext, loadDailyBoard, rankBy } from "@/lib/challenges";
import { fill } from "@/lib/copy";
import { displayName, formatValue } from "@/lib/format";
import { getVoice } from "@/lib/voice";

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function MonthPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<LoadingLine page="month" />}>
      <Month params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Month({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const { copy } = await getVoice();
  const { challenge } = await getChallengeContext(slug);
  const board = await loadDailyBoard(slug, one(query.m));
  const dailies = challenge.metrics.filter((metric) => metric.kind === "DAILY");

  if (!board.metric) {
    return (
      <section className="mt-8">
        <Pumpkin size={48} />
        <p className="mt-4 text-sm text-ink-soft">{copy.month.needTracker}</p>
      </section>
    );
  }

  const ranked = rankBy(board.rows, board.metric.higherIsBetter, "total");

  return (
    <section className="mt-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-4xl leading-none">{copy.month.title}</h2>
          <p className="mt-2 text-sm text-ink-soft">{copy.month.blurb}</p>
        </div>
      </div>

      {dailies.length > 1 ? (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {dailies.map((metric) => {
            const active = metric.id === board.metric?.id;
            return (
              <Link
                key={metric.id}
                href={`/c/${slug}/month?m=${metric.slug}`}
                className={`shrink-0 border border-ink px-3 py-2 text-sm ${
                  active ? "bg-ink text-paper" : "bg-paper-2"
                }`}
              >
                {metric.name}
              </Link>
            );
          })}
        </div>
      ) : null}

      <ol className="mt-6 border-t border-ink">
        {ranked.map((row) => {
          const name = displayName(row.member.name, row.member.nickname, copy.athlete);
          const harvested = Object.values(row.byDay).some((value) => value > 0);
          return (
            <li key={row.member.userId} className="border-b border-line py-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="min-w-0 truncate">
                  <span className="mr-2 inline-flex w-12 items-center justify-end gap-1 align-middle font-serif text-ink-soft">
                    {row.rank === 1 && harvested ? <Pumpkin size={16} /> : null}
                    {row.rank ?? "–"}
                  </span>
                  <span className="font-medium">{name}</span>
                  {row.member.isYou ? (
                    <span className="ml-2 text-xs text-ink-soft">{copy.you}</span>
                  ) : null}
                </p>
                <p className="font-serif text-4xl leading-none tabular-nums">
                  {formatValue(row.total, board.metric!.input)}
                  {board.metric!.input !== "DURATION" && board.metric!.unit ? (
                    <span className="ml-1 font-sans text-xs text-ink-soft">{board.metric!.unit}</span>
                  ) : null}
                </p>
              </div>
              <div
                className="mt-3 grid gap-1"
                style={{ gridTemplateColumns: `repeat(${Math.max(board.days.length, 1)}, minmax(0, 1fr))` }}
              >
                {board.days.map((day) => {
                  const value = row.byDay[day];
                  const logged = value !== undefined;
                  const harvested = logged && value > 0;
                  return (
                    <Link
                      key={day}
                      href={`/c/${slug}?d=${day}&m=${board.metric!.slug}`}
                      title={
                        logged
                          ? fill(copy.month.tipLogged, {
                              day,
                              value: formatValue(value, board.metric!.input),
                            })
                          : fill(copy.month.tipEmpty, { day })
                      }
                      aria-label={
                        logged
                          ? fill(copy.month.logged, { day })
                          : fill(copy.month.notLogged, { day })
                      }
                      className="flex min-h-11 items-end"
                    >
                      <span
                        aria-hidden="true"
                        className={`relative block h-4 w-full ${
                          !logged ? "bg-line" : value === 0 ? "bg-ink-soft" : "bg-ember"
                        }`}
                      >
                        {harvested ? (
                          <span className="absolute bottom-full left-1/2 h-1.5 w-0.5 -translate-x-1/2 bg-moss" />
                        ) : null}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
