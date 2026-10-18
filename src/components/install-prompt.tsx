"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useCopy } from "@/components/copy-provider";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallState = {
  /** iOS Safari: no install event, needs manual Add to Home Screen. */
  ios: boolean;
  /** Chrome/Edge/Android fired beforeinstallprompt and we can show a button. */
  canPrompt: boolean;
  /** Already running installed (standalone) or the user just accepted. */
  installed: boolean;
};

const SERVER_SNAPSHOT: InstallState = { ios: false, canPrompt: false, installed: true };

// One-shot install events can't be React state; keep them in a tiny external
// store so `useSyncExternalStore` handles the SSR/hydration transition for us.
let promptEvent: BeforeInstallPromptEvent | null = null;
let snapshot: InstallState | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function computeSnapshot(): InstallState {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    // iOS Safari reports standalone via this nonstandard quirk.
    (window.navigator as { standalone?: boolean }).standalone === true;
  if (standalone) return SERVER_SNAPSHOT;
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
  return { ios, canPrompt: promptEvent !== null, installed: false };
}

function getSnapshot(): InstallState {
  return (snapshot ??= computeSnapshot());
}

function getServerSnapshot(): InstallState {
  return SERVER_SNAPSHOT;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onPrompt = (event: Event) => {
    // Keep our own UI instead of Chrome's mini-infobar.
    event.preventDefault();
    promptEvent = event as BeforeInstallPromptEvent;
    snapshot = { ...getSnapshot(), canPrompt: true };
    emit();
  };
  const onInstalled = () => {
    promptEvent = null;
    snapshot = SERVER_SNAPSHOT;
    emit();
  };
  window.addEventListener("beforeinstallprompt", onPrompt);
  window.addEventListener("appinstalled", onInstalled);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("beforeinstallprompt", onPrompt);
    window.removeEventListener("appinstalled", onInstalled);
  };
}

async function promptInstall() {
  const event = promptEvent;
  if (!event) return;
  await event.prompt();
  await event.userChoice;
  promptEvent = null;
  snapshot = { ...getSnapshot(), canPrompt: false };
  emit();
}

// Chrome/Edge/Android fire `beforeinstallprompt`; iOS Safari never does and
// needs manual "Add to Home Screen" instead.
export function InstallPrompt() {
  const copy = useCopy();
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (state.installed) return null;
  if (!state.ios && !state.canPrompt) return null;

  return (
    <aside
      className="mx-auto mt-10 w-full max-w-md border border-ink bg-paper-2 p-4 shadow-[3px_3px_0_var(--ink)]"
      aria-label={copy.install.label}
    >
      <p className="font-serif text-2xl leading-none">{copy.install.title}</p>
      {state.ios ? (
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {copy.install.iosStep1}{" "}
          <span aria-hidden="true" className="whitespace-nowrap">
            ⎋
          </span>{" "}
          {copy.install.iosStep2}{" "}
          <span aria-hidden="true" className="whitespace-nowrap">
            ➕
          </span>{" "}
          {copy.install.iosStep3}
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{copy.install.androidBlurb}</p>
          <button
            type="button"
            onClick={promptInstall}
            className="mt-3 inline-flex min-h-11 items-center border border-ink bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-[color-mix(in_srgb,var(--ink),white_6%)]"
          >
            {copy.install.button}
          </button>
        </>
      )}
    </aside>
  );
}

// Registers the service worker once per page load. Silence on failure: PWA
// behavior is a bonus, never a blocker for using the site.
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).catch(() => {});
    };
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
    }
  }, []);
  return null;
}
