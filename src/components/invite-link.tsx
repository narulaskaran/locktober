"use client";

import { useRef, useState, useSyncExternalStore } from "react";
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

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API is blocked on some in-app browsers and plain http.
      field.current?.select();
      document.execCommand("copy");
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function share() {
    try {
      await navigator.share({
        title: `${boardName} on Loctober`,
        text: `Join "${boardName}" on Loctober. Sign in and you're on the board.`,
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
        value={url || "Preparing link…"}
        aria-label="Invite link"
        className="min-h-11 w-full border border-ink bg-paper px-3 text-sm"
        onFocus={(event) => event.currentTarget.select()}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        {canShare ? (
          <button type="button" className={`${btnEmber} flex-1`} onClick={share} disabled={!url}>
            Share invite
          </button>
        ) : null}
        <button
          type="button"
          className={`${canShare ? "bg-paper-2 text-ink hover:bg-white" : btnInk} inline-flex min-h-11 flex-1 items-center justify-center border border-ink px-4 text-sm font-medium`}
          onClick={copy}
          disabled={!url}
          aria-live="polite"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
