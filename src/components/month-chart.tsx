import { formatDay } from "@/lib/dates";
import { formatValue } from "@/lib/format";
import type { MetricInput } from "@/generated/prisma/client";

export type ChartSeries = {
  id: string;
  name: string;
  color: string;
  isYou: boolean;
  byDay: Record<string, number>;
};

function niceMax(value: number) {
  if (value <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 4, 6, 8, 10].find((candidate) => value / pow <= candidate) ?? 10;
  return step * pow;
}

/**
 * Running total per person across the board's days. Lines start at zero before
 * day one and stop at today, so you can see who is pulling away.
 */
export function MonthChart({
  days,
  today,
  series,
  input,
  unit,
}: {
  days: string[];
  today: string;
  series: ChartSeries[];
  input: MetricInput;
  unit: string;
}) {
  const count = days.length;
  const through = days.filter((day) => day <= today).length;
  if (count === 0 || through === 0) return null;

  const lines = series.map((item) => {
    let sum = 0;
    const totals = days.slice(0, through).map((day) => {
      sum += item.byDay[day] ?? 0;
      return sum;
    });
    return { ...item, totals };
  });
  const top = Math.max(...lines.map((line) => line.totals[line.totals.length - 1] ?? 0));
  if (top <= 0) return null;

  const yMax = niceMax(top);
  const x = (index: number) => ((index + 1) / count) * 100;
  const y = (value: number) => 100 - (value / yMax) * 100;
  const leader = [...lines].sort((a, b) => b.totals[through - 1] - a.totals[through - 1])[0];
  const unitLabel = input !== "DURATION" && unit ? ` ${unit}` : "";
  const todayX = x(through - 1);

  return (
    <figure className="mt-6">
      <div className="relative ml-1 mr-2 h-48 border-b border-l border-ink sm:h-60">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Running total by day. ${leader.name} leads with ${formatValue(
            leader.totals[through - 1],
            input,
          )}${unitLabel}.`}
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <line x1="0" x2="100" y1="50" y2="50" stroke="#d7cec1" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <line x1="0" x2="100" y1="0" y2="0" stroke="#d7cec1" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          {through < count ? (
            <line
              x1={todayX}
              x2={todayX}
              y1="0"
              y2="100"
              stroke="#5e564c"
              strokeWidth="1"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
          {[...lines]
            .sort((a, b) => Number(a.isYou) - Number(b.isYou))
            .map((line) => (
              <polyline
                key={line.id}
                fill="none"
                stroke={line.color}
                strokeWidth={line.isYou ? 3 : 2}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                points={[`0,100`, ...line.totals.map((total, index) => `${x(index)},${y(total)}`)].join(" ")}
              />
            ))}
        </svg>
        {lines.map((line) => (
          <span
            key={line.id}
            aria-hidden="true"
            className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 border border-paper"
            style={{
              left: `${x(through - 1)}%`,
              top: `${y(line.totals[through - 1])}%`,
              background: line.color,
            }}
          />
        ))}
        <span className="absolute left-1.5 top-1 text-[11px] tabular-nums text-ink-soft">
          {formatValue(yMax, input)}
        </span>
        {through < count ? (
          <span
            className="absolute bottom-1 text-[11px] uppercase tracking-[0.12em] text-ink-soft"
            style={todayX > 80 ? { right: `${100 - todayX}%`, paddingRight: 6 } : { left: `${todayX}%`, paddingLeft: 6 }}
          >
            Today
          </span>
        ) : null}
      </div>
      <figcaption className="ml-1 mr-2 mt-2 flex justify-between text-[11px] uppercase tracking-[0.12em] text-ink-soft">
        <span>{formatDay(days[0]).replace(/^[A-Za-z]{3}, /, "")}</span>
        <span>{formatDay(days[count - 1]).replace(/^[A-Za-z]{3}, /, "")}</span>
      </figcaption>
    </figure>
  );
}
