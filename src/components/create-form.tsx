"use client";

import { useActionState } from "react";
import { useCopy } from "@/components/copy-provider";
import { createChallenge, type ActionState } from "@/server/actions";
import { templates } from "@/lib/templates";
import { timezones } from "@/lib/timezones";
import { btnEmber, card, field } from "@/lib/styles";

const initial: ActionState = { ok: false };

export function CreateForm({ start, end }: { start: string; end: string }) {
  const [state, action, pending] = useActionState(createChallenge, initial);
  const copy = useCopy();

  return (
    <form action={action} className="flex flex-col gap-6">
      <label className="block">
        <span className="text-sm font-medium">{copy.create.name}</span>
        <input
          name="name"
          required
          maxLength={60}
          placeholder={copy.create.namePlaceholder}
          className={`${field} mt-2`}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">{copy.create.starts}</span>
          <input name="startDate" type="date" required defaultValue={start} className={`${field} mt-2`} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">{copy.create.ends}</span>
          <input name="endDate" type="date" required defaultValue={end} className={`${field} mt-2`} />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">{copy.create.timezone}</span>
        <select name="timezone" defaultValue="America/New_York" className={`${field} mt-2`}>
          {timezones.map((zone) => (
            <option key={zone.value} value={zone.value}>
              {copy.tz[zone.voice]}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="text-sm font-medium">{copy.create.tracking}</legend>
        <div className="mt-3 grid gap-3">
          {templates.map((template, index) => {
            const text = copy.templates[template.id];
            return (
              <label key={template.id} className={`${card} cursor-pointer p-4 has-[:checked]:bg-white`}>
                <span className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="template"
                    value={template.id}
                    defaultChecked={index === 0}
                    className="mt-1 accent-ember"
                  />
                  <span>
                    <span className="block font-medium">{text.name}</span>
                    <span className="mt-1 block text-sm text-ink-soft">{text.blurb}</span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {state.error ? (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}

      <button className={btnEmber} type="submit" disabled={pending}>
        {pending ? copy.pending.creating : copy.create.submit}
      </button>
    </form>
  );
}
