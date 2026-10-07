import { Suspense } from "react";
import { Pumpkin } from "@/components/pumpkin";
import { RankList } from "@/components/rank-list";
import { ScoreForm } from "@/components/score-form";
import { loadFinaleBoard } from "@/lib/challenges";
import { card } from "@/lib/styles";

export default function FinalePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<p className="mt-8 text-sm text-ink-soft">Loading the finale…</p>}>
      <Finale params={params} />
    </Suspense>
  );
}

async function Finale({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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

  return (
    <section className="mt-8 flex flex-col gap-10">
      <div>
        <h2 className="font-serif text-4xl leading-none">Finale</h2>
        <p className="mt-2 max-w-md text-sm text-ink-soft">
          One score per event. You can update it until three days after the board ends.
          {board.open ? "" : " The window for new scores is closed."}
        </p>
      </div>
      {board.events.map((event) => (
        <article key={event.metric.id}>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-3xl">{event.metric.name}</h3>
            <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
              {event.metric.higherIsBetter ? "Higher wins" : "Lower wins"}
            </p>
          </div>
          {board.open ? (
            <div className={`${card} mt-4 p-4`}>
              <ScoreForm
                mode="finale"
                slug={slug}
                metricId={event.metric.id}
                metricName={event.metric.name}
                unit={event.metric.unit}
                input={event.metric.input}
                initialValue={event.you?.value ?? null}
                submitLabel="Save score"
              />
            </div>
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
      ))}
    </section>
  );
}
