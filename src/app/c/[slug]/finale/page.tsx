import { Suspense } from "react";
import { LogSheet } from "@/components/log-sheet";
import { Pumpkin } from "@/components/pumpkin";
import { RankList } from "@/components/rank-list";
import { getChallengeContext, loadFinaleBoard } from "@/lib/challenges";
import { addDays, formatDay } from "@/lib/dates";
import { formatValueWithUnit } from "@/lib/format";

export default function FinalePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="mt-8 text-sm text-ink-soft">Loading the finale…</p>}>
      <Finale params={params} />
    </Suspense>
  );
}

async function Finale({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { challenge } = await getChallengeContext(slug);
  const board = await loadFinaleBoard(slug);

  if (board.events.length === 0) {
    return (
      <section className="mt-8">
        <Pumpkin size={48} />
        <h2 className="mt-4 font-serif text-4xl">No finale yet.</h2>
        <p className="mt-2 text-sm text-ink-soft">
          The owner can add one from the crew page. A max set of push-ups is the usual closer.
        </p>
      </section>
    );
  }

  const closes = formatDay(addDays(challenge.endDate, 3));

  return (
    <section className="mt-8 flex flex-col gap-10">
      <div>
        <h2 className="font-serif text-4xl leading-none">Finale</h2>
        <p className="mt-2 max-w-md text-sm text-ink-soft">
          {board.open
            ? `One score per event, and a new score replaces the old one. Scores lock after ${closes}.`
            : `Scores locked after ${closes}. These are the final standings.`}
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
                  {event.metric.higherIsBetter ? "Higher wins" : "Lower wins"}
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
                  subtitle="Finale"
                  title={event.metric.name}
                  triggerLabel={mine === null ? "Log score" : "Update score"}
                  tone={mine === null && board.events.length === 1 ? "ember" : "ghost"}
                />
              ) : null}
            </div>
            {best ? (
              <p className="mt-3 text-sm text-ink-soft">
                Leading:{" "}
                <span className="font-medium text-ink">
                  {best.member.nickname?.trim() || best.member.name.split(" ")[0]}
                </span>{" "}
                with {formatValueWithUnit(best.value!, event.metric.input, event.metric.unit)}
              </p>
            ) : null}
            <div className="mt-4">
              <RankList
                input={event.metric.input}
                unit={event.metric.unit}
                empty="No scores yet."
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
