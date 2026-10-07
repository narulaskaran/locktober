"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useCopy } from "@/components/copy-provider";
import { fill } from "@/lib/copy";
import { btnEmber, btnInk } from "@/lib/styles";

const noop = () => () => {};

export function InviteLink({ code, boardName }: { code: string; boardName: string }) {
  const origin = useSyncExternalStore(
    noop,
    () => window.location.origin,
    () => "",
  );
  const canShare = useSyncExternalStore(
    noop,
    () => typeof navigator.share === "function",
    () => false,
  );
  const url = origin ? `${origin}/join/${code}` : "";
  const field = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const text = useCopy();

  async function copyLink() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      field.current?.select();
      document.execCommand("copy");
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function share() {
    try {
      await navigator.share({
        title: fill(text.invite.shareTitle, { name: boardName }),
        text: fill(text.invite.shareText, { name: boardName }),
        url,
      });
    } catch {
      // Dismissing the share sheet rejects; nothing to do.
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={field}
        readOnly
        suppressHydrationWarning
        value={url || text.invite.preparing}
        aria-label={text.invite.label}
        className="min-h-11 w-full border border-ink bg-paper px-3 text-sm"
        onFocus={(event) => event.currentTarget.select()}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        {canShare ? (
          <button type="button" className={`${btnEmber} flex-1`} onClick={share} disabled={!url}>
            {text.invite.share}
          </button>
        ) : null}
        <button
          type="button"
          className={`${canShare ? "bg-paper-2 text-ink hover:bg-white" : btnInk} inline-flex min-h-11 flex-1 items-center justify-center border border-ink px-4 text-sm font-medium`}
          onClick={copyLink}
          disabled={!url}
          aria-live="polite"
        >
          {copied ? text.invite.copied : text.invite.copy}
        </button>
      </div>
    </div>
  );
}
