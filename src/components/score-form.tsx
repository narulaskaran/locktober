"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { logDaily, logFinale, type ActionState } from "@/server/actions";
import { formatValue } from "@/lib/format";
import { btnEmber, btnGhost, numberField } from "@/lib/styles";

type InputKind = "COUNT" | "DECIMAL" | "DURATION";

const initial: ActionState = { ok: false };

function clean(raw: string, input: InputKind) {
  if (input === "DECIMAL") {
    const [whole, ...rest] = raw.replace(/[^\d.]/g, "").split(".");
    const head = whole.slice(0, 5);
    return rest.length ? `${head}.${rest.join("").slice(0, 1)}` : head;
  }
  return raw.replace(/\D/g, "").slice(0, 6);
}

function toNumber(text: string) {
  const n = Number(text);
  return Number.isFinite(n) ? n : 0;
}

function seed(value: number | null | undefined) {
  return value ? String(value) : "";
}

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
  autoFocus,
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
  autoFocus?: boolean;
}) {
  const action = mode === "daily" ? logDaily : logFinale;
  const [state, formAction, pending] = useActionState(action, initial);
  const formId = useId();
  const amountField = useRef<HTMLInputElement>(null);
  const current = initialValue ?? 0;

  // People do sets through the day, so when today already has a number the
  // default is to add to it. "Set total" is there for corrections.
  const canAdd = mode === "daily" && input !== "DURATION" && current > 0;
  const [how, setHow] = useState<"add" | "set">(canAdd ? "add" : "set");
  const [text, setText] = useState(canAdd ? "" : seed(initialValue));
  const [minutes, setMinutes] = useState(
    input === "DURATION" && initialValue ? String(Math.floor(initialValue / 60)) : "",
  );
  const [seconds, setSeconds] = useState(
    input === "DURATION" && initialValue ? String(Math.round(initialValue % 60)) : "",
  );

  useEffect(() => {
    if (state.ok) onSaved?.();
  }, [state, onSaved]);

  const typed = toNumber(text);
  const adding = canAdd && how === "add";
  const value =
    input === "DURATION"
      ? toNumber(minutes) * 60 + Math.min(59, toNumber(seconds))
      : adding
        ? Math.round((current + typed) * 10) / 10
        : typed;
  const hasInput =
    input === "DURATION" ? minutes !== "" || seconds !== "" : adding ? typed > 0 : text !== "";

  function switchTo(next: "add" | "set") {
    setHow(next);
    setText(next === "add" ? "" : seed(initialValue));
    amountField.current?.focus();
  }

  function bump(by: number) {
    if (input === "DURATION") {
      const next = Math.max(0, toNumber(minutes) * 60 + toNumber(seconds) + by);
      setMinutes(String(Math.floor(next / 60)));
      setSeconds(String(next % 60));
      return;
    }
    const next = Math.max(0, Math.round((typed + by) * 10) / 10);
    setText(String(next));
  }

  const chips =
    input === "DECIMAL" ? [0.5, 1, 2] : input === "DURATION" ? [15, 30, 60] : [5, 10, 25];

  const hint =
    mode === "finale"
      ? input === "DURATION"
        ? "Lower time wins. Saving replaces your score."
        : "Saving replaces your score."
      : adding
        ? null
        : "Saving replaces the total for this day.";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="metricId" value={metricId} />
      <input type="hidden" name="value" value={value} />
      {date ? <input type="hidden" name="date" value={date} /> : null}

      {canAdd ? (
        <div className="grid grid-cols-2 border border-ink" role="group" aria-label="How to log">
          {(["add", "set"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={how === option}
              onClick={() => switchTo(option)}
              className={`min-h-11 text-sm font-medium ${
                how === option ? "bg-ink text-paper" : "bg-paper-2 text-ink hover:bg-white"
              }`}
            >
              {option === "add" ? "Add to today" : "Set total"}
            </button>
          ))}
        </div>
      ) : null}

      <div>
        {input === "DURATION" ? (
          <div className="flex items-end gap-3">
            <label className="flex-1">
              <span className="text-xs text-ink-soft">Minutes</span>
              <input
                className={`${numberField} mt-1`}
                inputMode="numeric"
                autoComplete="off"
                autoFocus={autoFocus}
                placeholder="0"
                value={minutes}
                onFocus={(event) => event.currentTarget.select()}
                onChange={(event) => setMinutes(clean(event.target.value, "COUNT"))}
              />
            </label>
            <label className="flex-1">
              <span className="text-xs text-ink-soft">Seconds</span>
              <input
                className={`${numberField} mt-1`}
                inputMode="numeric"
                autoComplete="off"
                placeholder="00"
                value={seconds}
                onFocus={(event) => event.currentTarget.select()}
                onChange={(event) => {
                  const next = clean(event.target.value, "COUNT").slice(0, 2);
                  setSeconds(Number(next) > 59 ? "59" : next);
                }}
              />
            </label>
          </div>
        ) : (
          <label htmlFor={formId}>
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft">
              {adding ? `Add ${metricName.toLowerCase()}` : metricName}
              {unit ? ` · ${unit}` : ""}
            </span>
            <input
              id={formId}
              ref={amountField}
              className={`${numberField} mt-2`}
              inputMode={input === "DECIMAL" ? "decimal" : "numeric"}
              autoComplete="off"
              autoFocus={autoFocus}
              placeholder="0"
              value={text}
              onFocus={(event) => event.currentTarget.select()}
              onChange={(event) => setText(clean(event.target.value, input))}
            />
          </label>
        )}
        {adding ? (
          <p className="mt-2 text-sm text-ink-soft" aria-live="polite">
            Today so far {formatValue(current, input)} →{" "}
            <span className="font-medium text-ink">{formatValue(value, input)}</span>
            {unit ? ` ${unit}` : ""}
          </p>
        ) : hint ? (
          <p className="mt-2 text-sm text-ink-soft">{hint}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button key={chip} type="button" className={btnGhost} onClick={() => bump(chip)}>
            +{input === "DURATION" ? (chip === 60 ? "1:00" : `${chip}s`) : chip}
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

      <button className={btnEmber} type="submit" disabled={pending || !hasInput}>
        {pending ? "Saving…" : (submitLabel ?? "Save")}
      </button>
    </form>
  );
}
