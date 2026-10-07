import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { Pumpkin } from "@/components/pumpkin";
import { displayName, formatValue } from "@/lib/format";
import type { MetricInput } from "@/generated/prisma/client";

export type RankItem = {
  id: string;
  rank: number | null;
  name: string;
  nickname: string | null;
  imageUrl: string | null;
  isYou: boolean;
  amount: number | null;
  detail?: string;
};

export function RankList({
  rows,
  input,
  unit,
  empty,
}: {
  rows: RankItem[];
  input: MetricInput;
  unit: string;
  empty: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="flex items-center gap-3 border-t border-ink py-4">
        <Pumpkin size={32} />
        <p className="text-sm text-ink-soft">{empty}</p>
      </div>
    );
  }

  return (
    <ol className="border-t border-ink">
      {rows.map((row) => {
        const name = displayName(row.name, row.nickname);
        const leader = row.rank === 1 && row.amount !== null && row.amount > 0;
        return (
          <li
            key={row.id}
            className={`flex items-center gap-3 border-b border-line px-2 py-3 ${
              row.isYou ? "bg-paper-2 shadow-[inset_3px_0_0_var(--ember)]" : ""
            }`}
          >
            <span className="flex w-12 shrink-0 items-center justify-end gap-1 font-serif text-lg tabular-nums text-ink-soft">
              {leader ? <Pumpkin size={18} /> : null}
              {row.rank ?? "–"}
            </span>
            <Avatar name={name} imageUrl={row.imageUrl} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {name}
                {row.isYou ? <span className="ml-2 text-xs font-normal text-ink-soft">You</span> : null}
              </p>
              {row.detail ? <p className="text-xs text-ink-soft">{row.detail}</p> : null}
            </div>
            <p className="font-serif text-3xl leading-none tabular-nums">
              {row.amount === null ? (
                <span className="text-ink-soft">—</span>
              ) : (
                <>
                  {formatValue(row.amount, input)}
                  {input !== "DURATION" && unit ? (
                    <span className="ml-1 font-sans text-xs font-medium text-ink-soft">{unit}</span>
                  ) : null}
                </>
              )}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export function DayLink({
  href,
  label,
  disabled,
  direction,
}: {
  href: string;
  label: string;
  disabled?: boolean;
  direction: "prev" | "next";
}) {
  const icon = (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d={direction === "prev" ? "M15 5 L8 12 L15 19" : "M9 5 L16 12 L9 19"}
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
  if (disabled) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex min-h-11 min-w-11 items-center justify-center border border-line text-ink-soft/50"
      >
        {icon}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex min-h-11 min-w-11 items-center justify-center border border-ink bg-paper-2"
    >
      {icon}
    </Link>
  );
}
