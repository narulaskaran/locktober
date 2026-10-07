"use client";

import { useActionState } from "react";
import { addMetric, renameChallenge, setNickname, type ActionState } from "@/server/actions";
import { btnGhost, card, field } from "@/lib/styles";

const initial: ActionState = { ok: false };

export function NicknameForm({ slug, nickname }: { slug: string; nickname: string }) {
  const [state, action, pending] = useActionState(setNickname, initial);
  return (
    <form action={action} className="flex flex-col gap-3">
      <h2 className="font-serif text-3xl">Your name on the board</h2>
      <input type="hidden" name="slug" value={slug} />
      <label>
        <span className="text-sm text-ink-soft">Nickname, or blank to use your account name.</span>
        <input name="nickname" defaultValue={nickname} maxLength={24} className={`${field} mt-2`} />
      </label>
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.ok && state.message ? <p className="text-sm text-moss">{state.message}</p> : null}
      <button className={`${btnGhost} self-start`} type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save nickname"}
      </button>
    </form>
  );
}

export function RenameForm({ slug, name }: { slug: string; name: string }) {
  const [state, action, pending] = useActionState(renameChallenge, initial);
  return (
    <form action={action} className="flex flex-col gap-3">
      <h2 className="font-serif text-3xl">Board name</h2>
      <input type="hidden" name="slug" value={slug} />
      <input name="name" required defaultValue={name} maxLength={60} className={field} />
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.message ? <p className="text-sm text-moss">{state.message}</p> : null}
      <button className={`${btnGhost} self-start`} type="submit" disabled={pending}>
        {pending ? "Saving…" : "Rename"}
      </button>
    </form>
  );
}

export function MetricForm({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(addMetric, initial);
  return (
    <form action={action} className={`${card} mt-4 grid gap-3 p-4`}>
      <h3 className="font-medium">Add a tracker</h3>
      <input type="hidden" name="slug" value={slug} />
      <label>
        <span className="text-sm">Name</span>
        <input name="name" required placeholder="Steps" className={`${field} mt-1`} />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label>
          <span className="text-sm">Unit</span>
          <input name="unit" placeholder="steps" className={`${field} mt-1`} />
        </label>
        <label>
          <span className="text-sm">When</span>
          <select name="kind" className={`${field} mt-1`} defaultValue="DAILY">
            <option value="DAILY">Every day</option>
            <option value="FINALE">Finale</option>
          </select>
        </label>
        <label>
          <span className="text-sm">Number</span>
          <select name="input" className={`${field} mt-1`} defaultValue="COUNT">
            <option value="COUNT">Whole number</option>
            <option value="DECIMAL">Decimal</option>
            <option value="DURATION">Time</option>
          </select>
        </label>
      </div>
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.ok && state.message ? <p className="text-sm text-moss">{state.message}</p> : null}
      <button className={`${btnGhost} self-start`} type="submit" disabled={pending}>
        {pending ? "Adding…" : "Add tracker"}
      </button>
    </form>
  );
}
