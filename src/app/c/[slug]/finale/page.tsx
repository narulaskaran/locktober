import { Suspense } from "react";
import { LoadingLine } from "@/components/loading-line";
import { Pumpkin } from "@/components/pumpkin";
import { RankList } from "@/components/rank-list";
import { ScoreForm } from "@/components/score-form";
import { loadFinaleBoard } from "@/lib/challenges";
import { card } from "@/lib/styles";
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

  return (
    <section className="mt-8 flex flex-col gap-10">
      <div>
        <h2 className="font-serif text-4xl leading-none">{copy.finale.title}</h2>
        <p className="mt-2 max-w-md text-sm text-ink-soft">
          {copy.finale.blurb}
          {board.open ? "" : ` ${copy.finale.closed}`}
        </p>
      </div>
      {board.events.map((event) => (
        <article key={event.metric.id}>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-3xl">{event.metric.name}</h3>
            <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
              {event.metric.higherIsBetter ? copy.finale.higher : copy.finale.lower}
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
                submitLabel={copy.finale.save}
              />
            </div>
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
      ))}
    </section>
  );
}
