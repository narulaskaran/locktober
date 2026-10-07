import Link from "next/link";
import { Suspense } from "react";
import { MonthChart } from "@/components/month-chart";
import { Pumpkin } from "@/components/pumpkin";
import { getChallengeContext, loadDailyBoard, rankBy } from "@/lib/challenges";
import { formatDay } from "@/lib/dates";
import { displayName, formatValue } from "@/lib/format";
import { memberColor } from "@/lib/palette";
import { chipOff, chipOn } from "@/lib/styles";

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
    <Suspense fallback={<p className="mt-8 text-sm text-ink-soft">Adding up the month…</p>}>
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
  const { challenge } = await getChallengeContext(slug);
  const board = await loadDailyBoard(slug, one(query.m));
  const dailies = challenge.metrics.filter((metric) => metric.kind === "DAILY");

  if (!board.metric) {
    return (
      <section className="mt-8">
        <Pumpkin size={48} />
        <p className="mt-4 text-sm text-ink-soft">Add a daily tracker from the crew page.</p>
      </section>
    );
  }

  const metric = board.metric;
  const summable = metric.input !== "DURATION";
  const unit = summable && metric.unit ? metric.unit : "";
  const ranked = rankBy(board.rows, metric.higherIsBetter, "total");
  const colors = new Map(
    board.rows.map((row, index) => [row.member.userId, memberColor(index, row.member.isYou)]),
  );
  const you = board.rows.find((row) => row.member.isYou);
  const yourDays = you ? Object.values(you.byDay).filter((value) => value > 0) : [];
  const crewTotal = board.rows.reduce((sum, row) => sum + row.total, 0);

  return (
    <section className="mt-8">
      <h2 className="font-serif text-4xl leading-none">Month volume</h2>
      <p className="mt-2 text-sm text-ink-soft">
        Every logged day, added up. Ember is a day above zero, a muted square is a zero, and a blank
        one has no number. Tap a square to open that day.
      </p>

      {dailies.length > 1 ? (
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {dailies.map((item) => {
            const active = item.id === metric.id;
            return (
              <Link
                key={item.id}
                href={`/c/${slug}/month?m=${item.slug}`}
                aria-current={active ? "true" : undefined}
                className={`shrink-0 ${active ? chipOn : chipOff}`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      ) : null}

      {summable && crewTotal > 0 ? (
        <>
          <dl className="mt-6 grid grid-cols-3 border border-ink bg-paper-2">
            <Stat label="Crew total" value={formatValue(crewTotal, metric.input)} unit={unit} />
            <Stat
              label="Your avg"
              value={yourDays.length ? formatValue((you?.total ?? 0) / yourDays.length, metric.input) : "—"}
              unit={yourDays.length ? unit : ""}
              divided
            />
            <Stat
              label="Best day"
              value={yourDays.length ? formatValue(Math.max(...yourDays), metric.input) : "—"}
              unit={unit}
              divided
            />
          </dl>
          <MonthChart
            days={board.days}
            today={board.today}
            input={metric.input}
            unit={metric.unit}
            series={board.rows.map((row) => ({
              id: row.member.userId,
              name: displayName(row.member.name, row.member.nickname),
              color: colors.get(row.member.userId)!,
              isYou: row.member.isYou,
              byDay: row.byDay,
            }))}
          />
        </>
      ) : null}

      <ol className="mt-8 border-t border-ink">
        {ranked.map((row) => {
          const name = displayName(row.member.name, row.member.nickname);
          const harvested = Object.values(row.byDay).some((value) => value > 0);
          return (
            <li key={row.member.userId} className="border-b border-line py-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="flex min-w-0 items-center gap-2">
                  <span className="flex w-12 shrink-0 items-center justify-end gap-1 font-serif text-lg text-ink-soft">
                    {row.rank === 1 && harvested ? <Pumpkin size={16} /> : null}
                    {row.rank ?? "–"}
                  </span>
                  {summable ? (
                    <span
                      aria-hidden="true"
                      className="size-2.5 shrink-0"
                      style={{ background: colors.get(row.member.userId) }}
                    />
                  ) : null}
                  <span className="truncate font-medium">{name}</span>
                  {row.member.isYou ? <span className="text-xs text-ink-soft">You</span> : null}
                </p>
                <p className="font-serif text-4xl leading-none tabular-nums">
                  {formatValue(row.total, metric.input)}
                  {unit ? (
                    <span className="ml-1 font-sans text-xs text-ink-soft">{unit}</span>
                  ) : null}
                </p>
              </div>
              <div
                className="mt-3 grid gap-px sm:gap-1"
                style={{ gridTemplateColumns: `repeat(${Math.max(board.days.length, 1)}, minmax(0, 1fr))` }}
              >
                {board.days.map((day) => {
                  const value = row.byDay[day];
                  const logged = value !== undefined;
                  const future = day > board.today;
                  const label = `${formatDay(day)}: ${
                    logged ? formatValue(value, metric.input) : future ? "not yet" : "not logged"
                  }`;
                  return (
                    <Link
                      key={day}
                      href={`/c/${slug}?d=${day}&m=${metric.slug}`}
                      title={label}
                      aria-label={label}
                      className="flex min-h-11 items-end"
                    >
                      <span
                        aria-hidden="true"
                        className={`relative block h-4 w-full ${
                          logged
                            ? value === 0
                              ? "bg-ink-soft"
                              : "bg-ember"
                            : future
                              ? "border border-line"
                              : "bg-line"
                        } ${day === board.today ? "outline outline-2 outline-offset-2 outline-ink" : ""}`}
                      >
                        {logged && value > 0 ? (
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

function Stat({
  label,
  value,
  unit,
  divided,
}: {
  label: string;
  value: string;
  unit?: string;
  divided?: boolean;
}) {
  return (
    <div className={`px-3 py-3 ${divided ? "border-l border-line" : ""}`}>
      <dt className="text-[11px] uppercase tracking-[0.12em] text-ink-soft">{label}</dt>
      <dd className="mt-1 font-serif text-3xl leading-none tabular-nums">
        {value}
        {unit ? <span className="ml-1 font-sans text-[11px] text-ink-soft">{unit}</span> : null}
      </dd>
    </div>
  );
}
