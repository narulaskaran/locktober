import "server-only";

import { cookies } from "next/headers";
import { english, minion, type Copy } from "@/lib/copy";
import type { TemplateId } from "@/lib/templates";
import type { TimezoneVoice } from "@/lib/timezones";

export const MINION_COOKIE = "minion";

type Covers<RequiredKeys extends string, Labels> = Exclude<RequiredKeys, keyof Labels> extends never
  ? true
  : never;

const templatesCovered: Covers<TemplateId, typeof english.templates> = true;
const zonesCovered: Covers<TimezoneVoice, typeof english.tz> = true;
void templatesCovered;
void zonesCovered;

export async function getVoice(): Promise<{ copy: Copy; minion: boolean }> {
  const jar = await cookies();
  const on = jar.get(MINION_COOKIE)?.value === "1";
  const copy: Copy = on ? minion : english;
  return { copy, minion: on };
}
