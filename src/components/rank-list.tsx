import Link from "next/link";
import { Avatar } from "@/components/avatar";
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
    return <p className="text-sm text-ink-soft">{empty}</p>;
  }

  return (
    <ol className="border-t border-ink">
      {rows.map((row) => {
        const name = displayName(row.name, row.nickname);
        return (
          <li
            key={row.id}
            className={`flex items-center gap-3 border-b border-line py-3 ${
              row.isYou ? "border-l-2 border-l-ember pl-3" : "pl-1"
            }`}
          >
            <span className="w-6 font-serif text-lg tabular-nums text-ink-soft">
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
  children,
  label,
  disabled,
}: {
  href: string;
  children: string;
  label: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span className="inline-flex min-h-11 min-w-11 items-center justify-center border border-line text-ink-soft">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex min-h-11 min-w-11 items-center justify-center border border-ink bg-paper-2"
    >
      {children}
    </Link>
  );
}
