import Link from "next/link";
import { Suspense } from "react";
import { LoadingLine } from "@/components/loading-line";
import { LogSheet } from "@/components/log-sheet";
import { DayLink, RankList } from "@/components/rank-list";
import { getChallengeContext, loadDailyBoard, rankBy } from "@/lib/challenges";
import { fill } from "@/lib/copy";
import { addDays, formatDay } from "@/lib/dates";
import { displayName, formatValue, ordinal } from "@/lib/format";
import { clearDaily } from "@/server/actions";
import { btnGhost } from "@/lib/styles";
import { getVoice } from "@/lib/voice";

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
    <Suspense fallback={<LoadingLine page="day" />}>
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
  const { copy } = await getVoice();
  const { challenge } = await getChallengeContext(slug);
  const board = await loadDailyBoard(slug, one(query.m), one(query.d));
  const dailies = challenge.metrics.filter((metric) => metric.kind === "DAILY");

  if (!board.metric) {
    return (
      <section className="mt-8">
        <h2 className="font-serif text-3xl">{copy.today.noMetricTitle}</h2>
        <p className="mt-2 text-sm text-ink-soft">{copy.today.noMetricBody}</p>
        <Link href={`/c/${slug}/crew`} className={`${btnGhost} mt-4`}>
          {copy.tabs.crew}
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
          label={copy.today.previousDay}
          direction="prev"
          disabled={prev < challenge.startDate}
        />
        <div className="text-center">
          <p className="font-serif text-3xl leading-none">{formatDay(board.date)}</p>
          {board.date !== board.today ? (
            <Link href={`/c/${slug}?${metricQuery}`} className="text-xs underline">
              {copy.today.back}
            </Link>
          ) : (
            <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">{copy.today.label}</p>
          )}
        </div>
        <DayLink
          href={`/c/${slug}?d=${next}&${metricQuery}`}
          label={copy.today.nextDay}
          direction="next"
          disabled={next > challenge.endDate || next > board.today}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border border-ink bg-paper-2 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
            {displayName(you?.member.name ?? copy.you, you?.member.nickname, copy.athlete)} ·{" "}
            {board.metric.name}
          </p>
          <p className="mt-1 font-serif text-5xl leading-none">
            {you?.value === null || you?.value === undefined ? (
              <span className="text-ink-soft">—</span>
            ) : (
              formatValue(you.value, board.metric.input)
            )}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {you?.rank
              ? fill(copy.today.youRank, { place: ordinal(you.rank, copy.ordinal) })
              : copy.today.youEmpty}
            {you && you.streak >= 2 ? ` ${fill(copy.today.streak, { count: you.streak })}` : ""}
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
                {copy.today.clear}
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-3xl">{copy.today.heading}</h2>
        <RankList
          input={board.metric.input}
          unit={board.metric.unit}
          empty={copy.today.empty}
          youLabel={copy.you}
          athlete={copy.athlete}
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
                ? fill(copy.today.detailStreak, {
                    streak: row.streak,
                    total: formatValue(row.total, board.metric!.input),
                  })
                : fill(copy.today.detailMonth, {
                    total: formatValue(row.total, board.metric!.input),
                  }),
          }))}
        />
      </div>
    </section>
  );
}

