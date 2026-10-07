"use client";

import { useActionState } from "react";
import { useCopy } from "@/components/copy-provider";
import { addMetric, renameChallenge, setNickname, type ActionState } from "@/server/actions";
import { btnGhost, card, field } from "@/lib/styles";

const initial: ActionState = { ok: false };

export function NicknameForm({ slug, nickname }: { slug: string; nickname: string }) {
  const [state, action, pending] = useActionState(setNickname, initial);
  const copy = useCopy();
  return (
    <form action={action} className="flex flex-col gap-3">
      <h2 className="font-serif text-3xl">{copy.crew.nickTitle}</h2>
      <input type="hidden" name="slug" value={slug} />
      <label>
        <span className="text-sm text-ink-soft">{copy.crew.nickHint}</span>
        <input name="nickname" defaultValue={nickname} maxLength={24} className={`${field} mt-2`} />
      </label>
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.ok && state.message ? <p className="text-sm text-moss">{state.message}</p> : null}
      <button className={`${btnGhost} self-start`} type="submit" disabled={pending}>
        {pending ? copy.pending.saving : copy.crew.nickSave}
      </button>
    </form>
  );
}

export function RenameForm({ slug, name }: { slug: string; name: string }) {
  const [state, action, pending] = useActionState(renameChallenge, initial);
  const copy = useCopy();
  return (
    <form action={action} className="flex flex-col gap-3">
      <h2 className="font-serif text-3xl">{copy.crew.boardName}</h2>
      <input type="hidden" name="slug" value={slug} />
      <input name="name" required defaultValue={name} maxLength={60} className={field} />
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.message ? <p className="text-sm text-moss">{state.message}</p> : null}
      <button className={`${btnGhost} self-start`} type="submit" disabled={pending}>
        {pending ? copy.pending.saving : copy.crew.rename}
      </button>
    </form>
  );
}

export function MetricForm({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(addMetric, initial);
  const copy = useCopy();
  return (
    <form action={action} className={`${card} mt-4 grid gap-3 p-4`}>
      <h3 className="font-medium">{copy.crew.addTitle}</h3>
      <input type="hidden" name="slug" value={slug} />
      <label>
        <span className="text-sm">{copy.crew.name}</span>
        <input
          name="name"
          required
          placeholder={copy.crew.namePlaceholder}
          className={`${field} mt-1`}
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label>
          <span className="text-sm">{copy.crew.unit}</span>
          <input name="unit" placeholder={copy.crew.unitPlaceholder} className={`${field} mt-1`} />
        </label>
        <label>
          <span className="text-sm">{copy.crew.when}</span>
          <select name="kind" className={`${field} mt-1`} defaultValue="DAILY">
            <option value="DAILY">{copy.crew.everyDay}</option>
            <option value="FINALE">{copy.crew.finale}</option>
          </select>
        </label>
        <label>
          <span className="text-sm">{copy.crew.number}</span>
          <select name="input" className={`${field} mt-1`} defaultValue="COUNT">
            <option value="COUNT">{copy.crew.whole}</option>
            <option value="DECIMAL">{copy.crew.decimal}</option>
            <option value="DURATION">{copy.crew.time}</option>
          </select>
        </label>
      </div>
      {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
      {state.ok && state.message ? <p className="text-sm text-moss">{state.message}</p> : null}
      <button className={`${btnGhost} self-start`} type="submit" disabled={pending}>
        {pending ? copy.pending.adding : copy.crew.add}
      </button>
    </form>
  );
}
