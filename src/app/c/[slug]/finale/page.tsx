import { Suspense } from "react";
import { LoadingLine } from "@/components/loading-line";
import { LogSheet } from "@/components/log-sheet";
import { Pumpkin } from "@/components/pumpkin";
import { RankList } from "@/components/rank-list";
import { getChallengeContext, loadFinaleBoard } from "@/lib/challenges";
import { fill } from "@/lib/copy";
import { addDays, formatDay } from "@/lib/dates";
import { displayName, formatValueWithUnit } from "@/lib/format";
import { getVoice } from "@/lib/voice";

export default function FinalePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<LoadingLine page="finale" />}>
      <Finale params={params} />
    </Suspense>
  );
}

async function Finale({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { copy } = await getVoice();
  const { challenge } = await getChallengeContext(slug);
  const board = await loadFinaleBoard(slug);

  if (board.events.length === 0) {
    return (
      <section className="mt-8">
        <Pumpkin size={48} />
        <h2 className="mt-4 font-serif text-4xl">{copy.finale.emptyTitle}</h2>
        <p className="mt-2 text-sm text-ink-soft">{copy.finale.emptyBody}</p>
      </section>
    );
  }

  const closes = formatDay(addDays(challenge.endDate, 3));

  return (
    <section className="mt-8 flex flex-col gap-10">
      <div>
        <h2 className="font-serif text-4xl leading-none">{copy.finale.title}</h2>
        <p className="mt-2 max-w-md text-sm text-ink-soft">
          {board.open
            ? fill(copy.finale.openBlurb, { date: closes })
            : fill(copy.finale.closedBlurb, { date: closes })}
        </p>
      </div>
      {board.events.map((event) => {
        const mine = event.you?.value ?? null;
        const best = event.ranked.find((row) => row.rank === 1 && row.value !== null);
        return (
          <article key={event.metric.id}>
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
                  {event.metric.higherIsBetter ? copy.finale.higher : copy.finale.lower}
                </p>
                <h3 className="mt-1 font-serif text-3xl leading-none">{event.metric.name}</h3>
              </div>
              {board.open ? (
                <LogSheet
                  mode="finale"
                  slug={slug}
                  metricId={event.metric.id}
                  metricName={event.metric.name}
                  unit={event.metric.unit}
                  input={event.metric.input}
                  initialValue={mine}
                  subtitle={copy.finale.title}
                  title={event.metric.name}
                  triggerLabel={mine === null ? copy.finale.logScore : copy.finale.updateScore}
                  submitLabel={copy.finale.save}
                  tone={mine === null && board.events.length === 1 ? "ember" : "ghost"}
                />
              ) : null}
            </div>
            {best ? (
              <p className="mt-3 text-sm text-ink-soft">
                {copy.finale.leading}{" "}
                <span className="font-medium text-ink">
                  {displayName(best.member.name, best.member.nickname, copy.athlete)}
                </span>{" "}
                {fill(copy.finale.withScore, {
                  value: formatValueWithUnit(best.value!, event.metric.input, event.metric.unit),
                })}
              </p>
            ) : null}
            <div className="mt-4">
              <RankList
                input={event.metric.input}
                unit={event.metric.unit}
                empty={copy.finale.empty}
                youLabel={copy.you}
                athlete={copy.athlete}
                rows={event.ranked.map((row) => ({
                  id: row.member.userId,
                  rank: row.rank,
                  name: row.member.name,
                  nickname: row.member.nickname,
                  imageUrl: row.member.imageUrl,
                  isYou: row.member.isYou,
                  amount: row.value,
                }))}
              />
            </div>
          </article>
        );
      })}
    </section>
  );
}
