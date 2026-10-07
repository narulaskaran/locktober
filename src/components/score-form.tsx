"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { useCopy } from "@/components/copy-provider";
import { logDaily, logFinale, type ActionState } from "@/server/actions";
import { fill } from "@/lib/copy";
import { btnEmber, btnGhost, field } from "@/lib/styles";

type InputKind = "COUNT" | "DECIMAL" | "DURATION";

const initial: ActionState = { ok: false };

export function ScoreForm({
  mode,
  slug,
  metricId,
  metricName,
  unit,
  input,
  date,
  initialValue,
  onSaved,
  submitLabel,
}: {
  mode: "daily" | "finale";
  slug: string;
  metricId: string;
  metricName: string;
  unit: string;
  input: InputKind;
  date?: string;
  initialValue: number | null;
  onSaved?: () => void;
  submitLabel?: string;
}) {
  const action = mode === "daily" ? logDaily : logFinale;
  const [state, formAction, pending] = useActionState(action, initial);
  const copy = useCopy();
  const formId = useId();
  const starting = initialValue ?? 0;
  const [amount, setAmount] = useState(input === "DURATION" ? 0 : starting);
  const [minutes, setMinutes] = useState(
    input === "DURATION" ? Math.floor(starting / 60) : 0,
  );
  const [seconds, setSeconds] = useState(
    input === "DURATION" ? Math.round(starting % 60) : 0,
  );

  useEffect(() => {
    if (state.ok) onSaved?.();
  }, [state, onSaved]);

  const value =
    input === "DURATION" ? minutes * 60 + Math.min(59, Math.max(0, seconds)) : amount;

  function bump(by: number) {
    if (input === "DURATION") {
      const next = Math.max(0, minutes * 60 + seconds + by);
      setMinutes(Math.floor(next / 60));
      setSeconds(next % 60);
      return;
    }
    const next = Math.max(0, Math.round((amount + by) * 10) / 10);
    setAmount(next);
  }

  const chips =
    input === "DECIMAL" ? [0.5, 1, 2] : input === "DURATION" ? [15, 30, 60] : [5, 10, 25];

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="metricId" value={metricId} />
      <input type="hidden" name="value" value={value} />
      {date ? <input type="hidden" name="date" value={date} /> : null}

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft">
          {metricName}
        </p>
        {input === "DURATION" ? (
          <div className="mt-2 flex items-end gap-3">
            <label className="flex-1">
              <span className="text-xs text-ink-soft">{copy.score.minutes}</span>
              <input
                className={`${field} mt-1 font-serif text-4xl`}
                inputMode="numeric"
                min={0}
                type="number"
                value={minutes}
                onChange={(event) => setMinutes(Math.max(0, Number(event.target.value) || 0))}
              />
            </label>
            <label className="flex-1">
              <span className="text-xs text-ink-soft">{copy.score.seconds}</span>
              <input
                className={`${field} mt-1 font-serif text-4xl`}
                inputMode="numeric"
                min={0}
                max={59}
                type="number"
                value={seconds}
                onChange={(event) =>
                  setSeconds(Math.min(59, Math.max(0, Number(event.target.value) || 0)))
                }
              />
            </label>
          </div>
        ) : (
          <label className="mt-2 block" htmlFor={formId}>
            <span className="sr-only">{metricName}</span>
            <input
              id={formId}
              className={`${field} font-serif text-5xl`}
              inputMode={input === "DECIMAL" ? "decimal" : "numeric"}
              min={0}
              step={input === "DECIMAL" ? "0.1" : "1"}
              type="number"
              value={amount}
              onChange={(event) => setAmount(Math.max(0, Number(event.target.value) || 0))}
            />
          </label>
        )}
        <p className="mt-2 text-sm text-ink-soft">
          {mode === "finale"
            ? input === "DURATION"
              ? copy.score.lowerWins
              : copy.score.replacesFinale
            : fill(copy.score.replacesDay, { unit: unit ? ` (${unit})` : "" })}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            className={btnGhost}
            onClick={() => bump(chip)}
          >
            +{input === "DURATION" ? (chip === 60 ? "1:00" : `${chip}${copy.score.secondMark}`) : chip}
          </button>
        ))}
      </div>

      {state.error ? (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.ok && state.message ? (
        <p className="text-sm text-moss" role="status">
          {state.message}
        </p>
      ) : null}

      <button className={btnEmber} type="submit" disabled={pending}>
        {pending ? copy.pending.saving : submitLabel ?? copy.score.save}
      </button>
    </form>
  );
}
