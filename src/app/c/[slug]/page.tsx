import Link from "next/link";
import { Suspense } from "react";
import { LogSheet } from "@/components/log-sheet";
import { Pumpkin } from "@/components/pumpkin";
import { DayLink, RankList } from "@/components/rank-list";
import { getChallengeContext, loadDailyBoard, rankBy } from "@/lib/challenges";
import { addDays, formatDay } from "@/lib/dates";
import { displayName, formatValue } from "@/lib/format";
import { clearDaily } from "@/server/actions";
import { btnGhost } from "@/lib/styles";

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function TodayPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<p className="mt-8 text-sm text-ink-soft">Loading the day…</p>}>
      <Today params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Today({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const { challenge } = await getChallengeContext(slug);
  const board = await loadDailyBoard(slug, one(query.m), one(query.d));
  const dailies = challenge.metrics.filter((metric) => metric.kind === "DAILY");

  if (!board.metric) {
    return (
      <section className="mt-8">
        <Pumpkin size={48} />
        <h2 className="mt-4 font-serif text-3xl">No daily tracker yet.</h2>
        <p className="mt-2 text-sm text-ink-soft">Add one from the crew page.</p>
        <Link href={`/c/${slug}/crew`} className={`${btnGhost} mt-4`}>
          Crew
        </Link>
      </section>
    );
  }

  const ranked = rankBy(board.rows, board.metric.higherIsBetter, "value");
  const you = ranked.find((row) => row.member.isYou);
  const prev = addDays(board.date, -1);
  const next = addDays(board.date, 1);
  const metricQuery = `m=${board.metric.slug}`;

  return (
    <section className="mt-8">
      {dailies.length > 1 ? (
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {dailies.map((metric) => {
            const active = metric.id === board.metric?.id;
            return (
              <Link
                key={metric.id}
                href={`/c/${slug}?d=${board.date}&m=${metric.slug}`}
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

      <div className="flex items-center justify-between gap-3">
        <DayLink
          href={`/c/${slug}?d=${prev}&${metricQuery}`}
          label="Previous day"
          direction="prev"
          disabled={prev < challenge.startDate}
        />
        <div className="text-center">
          <p className="font-serif text-3xl leading-none">{formatDay(board.date)}</p>
          {board.date !== board.today ? (
            <Link href={`/c/${slug}?${metricQuery}`} className="text-xs underline">
              Back to today
            </Link>
          ) : (
            <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">Today</p>
          )}
        </div>
        <DayLink
          href={`/c/${slug}?d=${next}&${metricQuery}`}
          label="Next day"
          direction="next"
          disabled={next > challenge.endDate || next > board.today}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border border-ink bg-paper-2 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
            {displayName(you?.member.name ?? "You", you?.member.nickname)} · {board.metric.name}
          </p>
          <p className="mt-1 font-serif text-5xl leading-none">
            {you?.value === null || you?.value === undefined ? (
              <span className="text-ink-soft">—</span>
            ) : (
              formatValue(you.value, board.metric.input)
            )}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {you?.rank ? `You're ${place(you.rank)} on this day.` : "You haven't logged this day."}
            {you && you.streak >= 2 ? ` ${you.streak}-day streak.` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LogSheet
            slug={slug}
            metricId={board.metric.id}
            metricName={board.metric.name}
            unit={board.metric.unit}
            input={board.metric.input}
            date={board.date}
            initialValue={you?.value ?? null}
          />
          {you?.value !== null && you?.value !== undefined ? (
            <form action={clearDaily}>
              <input type="hidden" name="slug" value={slug} />
              <input type="hidden" name="metricId" value={board.metric.id} />
              <input type="hidden" name="date" value={board.date} />
              <button className={btnGhost} type="submit">
                Clear
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-3xl">The day</h2>
        <RankList
          input={board.metric.input}
          unit={board.metric.unit}
          empty="Nobody is on this board yet."
          rows={ranked.map((row) => ({
            id: row.member.userId,
            rank: row.rank,
            name: row.member.name,
            nickname: row.member.nickname,
            imageUrl: row.member.imageUrl,
            isYou: row.member.isYou,
            amount: row.value,
            detail:
              row.streak >= 2
                ? `${row.streak}-day streak · ${formatValue(row.total, board.metric!.input)} this month`
                : `${formatValue(row.total, board.metric!.input)} this month`,
          }))}
        />
      </div>
    </section>
  );
}

function place(rank: number) {
  const mod = rank % 100;
  if (mod >= 11 && mod <= 13) return `${rank}th`;
  switch (rank % 10) {
    case 1:
      return `${rank}st`;
    case 2:
      return `${rank}nd`;
    case 3:
      return `${rank}rd`;
    default:
      return `${rank}th`;
  }
}
