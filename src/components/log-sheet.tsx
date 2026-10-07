"use client";

import { useEffect, useState } from "react";
import { useCopy } from "@/components/copy-provider";
import { ScoreForm } from "@/components/score-form";
import { fill } from "@/lib/copy";
import { btnEmber, btnGhost, card } from "@/lib/styles";

export function LogSheet({
  slug,
  metricId,
  metricName,
  unit,
  input,
  date,
  initialValue,
  label,
}: {
  slug: string;
  metricId: string;
  metricName: string;
  unit: string;
  input: "COUNT" | "DECIMAL" | "DURATION";
  date: string;
  initialValue: number | null;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const copy = useCopy();

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button className={btnEmber} type="button" onClick={() => setOpen(true)}>
        {label ?? fill(copy.today.log, { name: metricName.toLowerCase() })}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label={copy.today.closeLog}
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="log-title"
            className={`${card} absolute inset-x-3 bottom-3 z-10 max-h-[85vh] overflow-y-auto p-5 sm:inset-x-auto sm:left-1/2 sm:w-[26rem] sm:-translate-x-1/2`}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 id="log-title" className="font-serif text-3xl leading-none">
                {copy.today.logTitle}
              </h2>
              <button type="button" className={btnGhost} onClick={() => setOpen(false)}>
                {copy.today.close}
              </button>
            </div>
            <ScoreForm
              mode="daily"
              slug={slug}
              metricId={metricId}
              metricName={metricName}
              unit={unit}
              input={input}
              date={date}
              initialValue={initialValue}
              onSaved={() => setOpen(false)}
              submitLabel={copy.today.saveDay}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
