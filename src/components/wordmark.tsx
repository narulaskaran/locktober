"use client";

import Link from "next/link";
import { useCopy } from "@/components/copy-provider";

export function Wordmark({ href = "/" }: { href?: string }) {
  const copy = useCopy();
  return (
    <Link href={href} className="inline-flex items-baseline gap-2">
      <span className="font-serif text-2xl leading-none italic tracking-tight">
        {copy.brand}
      </span>
      <span className="mb-0.5 hidden text-[10px] font-medium uppercase tracking-[0.18em] text-ink-soft sm:inline">
        {copy.brandTag}
      </span>
    </Link>
  );
}
