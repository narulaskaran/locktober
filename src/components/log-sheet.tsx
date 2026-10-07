"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScoreForm } from "@/components/score-form";
import { btnEmber, btnGhost, card } from "@/lib/styles";

export function LogSheet({
  mode = "daily",
  slug,
  metricId,
  metricName,
  unit,
  input,
  date,
  initialValue,
  triggerLabel,
  title,
  subtitle,
  submitLabel,
  tone = "ember",
}: {
  mode?: "daily" | "finale";
  slug: string;
  metricId: string;
  metricName: string;
  unit: string;
  input: "COUNT" | "DECIMAL" | "DURATION";
  date?: string;
  initialValue: number | null;
  triggerLabel?: string;
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  tone?: "ember" | "ghost";
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={trigger}
        className={tone === "ember" ? btnEmber : btnGhost}
        type="button"
        onClick={() => setOpen(true)}
      >
        {triggerLabel ?? `Log ${metricName.toLowerCase()}`}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close"
            tabIndex={-1}
            className="absolute inset-0 bg-ink/40"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="log-title"
            className={`${card} absolute inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-10 max-h-[85dvh] overflow-y-auto p-5 sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/3 sm:w-[26rem] sm:-translate-x-1/2`}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                {subtitle ? (
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft">
                    {subtitle}
                  </p>
                ) : null}
                <h2 id="log-title" className="mt-1 font-serif text-3xl leading-none">
                  {title ?? `Log ${metricName.toLowerCase()}`}
                </h2>
              </div>
              <button type="button" className={btnGhost} onClick={close}>
                Close
              </button>
            </div>
            <ScoreForm
              mode={mode}
              slug={slug}
              metricId={metricId}
              metricName={metricName}
              unit={unit}
              input={input}
              date={date}
              initialValue={initialValue}
              onSaved={close}
              submitLabel={submitLabel ?? (mode === "daily" ? "Save" : "Save score")}
              autoFocus
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
