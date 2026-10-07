"use client";

import { useState } from "react";
import { useCopy } from "@/components/copy-provider";
import { btnInk } from "@/lib/styles";

export function InviteLink({ code }: { code: string }) {
  const url =
    typeof window === "undefined" ? "" : `${window.location.origin}/join/${code}`;
  const [copied, setCopied] = useState(false);
  const text = useCopy();

  async function copyLink() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        readOnly
        suppressHydrationWarning
        value={url || text.invite.preparing}
        aria-label={text.invite.label}
        className="min-h-11 w-full border border-ink bg-paper px-3 text-sm"
        onFocus={(event) => event.currentTarget.select()}
      />
      <button type="button" className={btnInk} onClick={copyLink}>
        {copied ? text.invite.copied : text.invite.copy}
      </button>
    </div>
  );
}
