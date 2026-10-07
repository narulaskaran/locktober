"use client";

import { useCopy } from "@/components/copy-provider";

export function LoadingLine({
  page,
  className = "mt-8 text-sm text-ink-soft",
}: {
  page: "day" | "month" | "finale" | "crew" | "invite";
  className?: string;
}) {
  const copy = useCopy();
  return <p className={className}>{copy.loading[page]}</p>;
}
