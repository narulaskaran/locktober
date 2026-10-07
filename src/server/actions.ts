"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { MetricInput, MetricKind } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth";
import { fill, type Copy } from "@/lib/copy";
import { addDays, asDbDate, daysBetween, todayISO } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { inviteCode, metricSlug, slugify } from "@/lib/slug";
import { templateById } from "@/lib/templates";
import { timezones } from "@/lib/timezones";
import { getVoice } from "@/lib/voice";

export type ActionState = {
  ok: boolean;
  error?: string;
  message?: string;
};

function firstError(error: z.ZodError, fallback: string) {
  return error.issues[0]?.message ?? fallback;
}

async function membership(slug: string, userId: string) {
  const challenge = await prisma.challenge.findUnique({
    where: { slug },
    include: { metrics: true, members: true },
  });
  if (!challenge) return null;
  const member = challenge.members.find((item) => item.userId === userId);
  if (!member) return null;
  return { challenge, member };
}

function refresh(slug: string) {
  revalidatePath("/home");
  revalidatePath(`/c/${slug}`);
  revalidatePath(`/c/${slug}/month`);
  revalidatePath(`/c/${slug}/finale`);
  revalidatePath(`/c/${slug}/crew`);
}

function normalize(value: number, input: MetricInput, copy: Copy) {
  if (!Number.isFinite(value) || value < 0) {
    return copy.err.negative;
  }
  if (input === "COUNT") {
    if (value > 100_000) return copy.err.tooBig;
    return Math.round(value);
  }
  if (input === "DECIMAL") {
    if (value > 10_000) return copy.err.tooBig;
    return Math.round(value * 10) / 10;
  }
  if (value > 86_400) return copy.err.time;
  return Math.round(value);
}

export async function createChallenge(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const { copy } = await getVoice();
  const parsed = z
    .object({
      name: z.string().trim().min(2, copy.err.nameShort).max(60, copy.err.nameLong),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, copy.err.start),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, copy.err.end),
      timezone: z.string().min(1),
      template: z.string().min(1),
    })
    .safeParse({
      name: formData.get("name"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      timezone: formData.get("timezone"),
      template: formData.get("template"),
    });

  if (!parsed.success) return { ok: false, error: firstError(parsed.error, copy.err.check) };
  const { name, startDate, endDate, timezone, template } = parsed.data;
  if (!timezones.some((zone) => zone.value === timezone)) {
    return { ok: false, error: copy.err.zone };
  }
  if (endDate < startDate) {
    return { ok: false, error: copy.err.endBefore };
  }
  const span = daysBetween(startDate, endDate);
  if (span > 45) {
    return { ok: false, error: copy.err.span };
  }

  const chosen = templateById(template);
  let slug = slugify(name);
  let code = inviteCode();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const clash = await prisma.challenge.findFirst({
      where: { OR: [{ slug }, { inviteCode: code }] },
      select: { id: true },
    });
    if (!clash) break;
    slug = slugify(name);
    code = inviteCode();
  }

  const challenge = await prisma.challenge.create({
    data: {
      name,
      slug,
      startDate: asDbDate(startDate),
      endDate: asDbDate(endDate),
      timezone,
      inviteCode: code,
      members: {
        create: { userId: user.id, role: "OWNER" },
      },
      metrics: {
        create: chosen.metrics.map((metric, index) => ({
          name: metric.name,
          slug: uniqueMetricSlug(chosen.metrics, index),
          unit: metric.unit,
          kind: metric.kind,
          input: metric.input,
          higherIsBetter: metric.higherIsBetter,
          sortOrder: index,
        })),
      },
    },
  });

  redirect(`/c/${challenge.slug}/crew?welcome=1`);
}

function uniqueMetricSlug(metrics: readonly { name: string }[], index: number) {
  const base = metricSlug(metrics[index].name);
  const prior = metrics.slice(0, index).map((metric) => metricSlug(metric.name));
  if (!prior.includes(base)) return base;
  return `${base}-${index + 1}`;
}

export async function logDaily(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const { copy } = await getVoice();
  const parsed = z
    .object({
      slug: z.string().min(1),
      metricId: z.string().min(1),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      value: z.coerce.number(),
    })
    .safeParse({
      slug: formData.get("slug"),
      metricId: formData.get("metricId"),
      date: formData.get("date"),
      value: formData.get("value"),
    });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error, copy.err.check) };

  const found = await membership(parsed.data.slug, user.id);
  if (!found) return { ok: false, error: copy.err.notOnBoard };
  const metric = found.challenge.metrics.find(
    (item) => item.id === parsed.data.metricId && item.kind === "DAILY",
  );
  if (!metric) return { ok: false, error: copy.err.logMissing };

  const start = found.challenge.startDate.toISOString().slice(0, 10);
  const end = found.challenge.endDate.toISOString().slice(0, 10);
  const today = todayISO(found.challenge.timezone);
  if (parsed.data.date < start || parsed.data.date > end) {
    return { ok: false, error: copy.err.dayOutside };
  }
  if (parsed.data.date > today) {
    return { ok: false, error: copy.err.future };
  }

  const value = normalize(parsed.data.value, metric.input, copy);
  if (typeof value === "string") return { ok: false, error: value };

  await prisma.entry.upsert({
    where: {
      metricId_userId_date: {
        metricId: metric.id,
        userId: user.id,
        date: asDbDate(parsed.data.date),
      },
    },
    update: { value },
    create: {
      challengeId: found.challenge.id,
      metricId: metric.id,
      userId: user.id,
      date: asDbDate(parsed.data.date),
      value,
    },
  });

  refresh(found.challenge.slug);
  return { ok: true, message: copy.ok.saved };
}

export async function clearDaily(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const metricId = String(formData.get("metricId") ?? "");
  const date = String(formData.get("date") ?? "");
  const found = await membership(slug, user.id);
  if (!found || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  await prisma.entry.deleteMany({
    where: { metricId, userId: user.id, date: asDbDate(date) },
  });
  refresh(slug);
}

export async function logFinale(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const { copy } = await getVoice();
  const parsed = z
    .object({
      slug: z.string().min(1),
      metricId: z.string().min(1),
      value: z.coerce.number(),
    })
    .safeParse({
      slug: formData.get("slug"),
      metricId: formData.get("metricId"),
      value: formData.get("value"),
    });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error, copy.err.check) };

  const found = await membership(parsed.data.slug, user.id);
  if (!found) return { ok: false, error: copy.err.notOnBoard };
  const metric = found.challenge.metrics.find(
    (item) => item.id === parsed.data.metricId && item.kind === "FINALE",
  );
  if (!metric) return { ok: false, error: copy.err.eventMissing };

  const end = found.challenge.endDate.toISOString().slice(0, 10);
  const start = found.challenge.startDate.toISOString().slice(0, 10);
  const today = todayISO(found.challenge.timezone);
  if (today < start || today > addDays(end, 3)) {
    return { ok: false, error: copy.err.finaleClosed };
  }

  const value = normalize(parsed.data.value, metric.input, copy);
  if (typeof value === "string") return { ok: false, error: value };

  await prisma.finaleEntry.upsert({
    where: {
      metricId_userId: { metricId: metric.id, userId: user.id },
    },
    update: { value },
    create: {
      challengeId: found.challenge.id,
      metricId: metric.id,
      userId: user.id,
      value,
    },
  });

  refresh(found.challenge.slug);
  return { ok: true, message: copy.ok.finaleSaved };
}

export async function joinChallenge(formData: FormData) {
  const user = await requireUser();
  const code = String(formData.get("code") ?? "");
  const challenge = await prisma.challenge.findUnique({
    where: { inviteCode: code },
  });
  if (!challenge) redirect("/home?notice=bad-invite");

  await prisma.challengeMember.upsert({
    where: {
      challengeId_userId: { challengeId: challenge.id, userId: user.id },
    },
    update: {},
    create: { challengeId: challenge.id, userId: user.id, role: "MEMBER" },
  });

  revalidatePath("/home");
  redirect(`/c/${challenge.slug}`);
}

export async function renameChallenge(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const { copy } = await getVoice();
  const slug = String(formData.get("slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 60) {
    return { ok: false, error: copy.err.renameLength };
  }
  const found = await membership(slug, user.id);
  if (!found || found.member.role !== "OWNER") {
    return { ok: false, error: copy.err.renameOwner };
  }
  await prisma.challenge.update({ where: { id: found.challenge.id }, data: { name } });
  refresh(slug);
  return { ok: true, message: copy.ok.nameUpdated };
}

export async function setNickname(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const { copy } = await getVoice();
  const slug = String(formData.get("slug") ?? "");
  const nickname = String(formData.get("nickname") ?? "").trim();
  if (nickname.length > 24) {
    return { ok: false, error: copy.err.nickLength };
  }
  const found = await membership(slug, user.id);
  if (!found) return { ok: false, error: copy.err.notOnBoard };
  await prisma.challengeMember.update({
    where: { id: found.member.id },
    data: { nickname: nickname || null },
  });
  refresh(slug);
  return { ok: true, message: nickname ? copy.ok.nicknameSaved : copy.ok.accountName };
}

export async function addMetric(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const { copy } = await getVoice();
  const parsed = z
    .object({
      slug: z.string().min(1),
      name: z.string().trim().min(2, copy.err.trackerName).max(40, copy.err.trackerNameLong),
      unit: z.string().trim().max(12, copy.err.unitLong).default(""),
      kind: z.enum(["DAILY", "FINALE"]),
      input: z.enum(["COUNT", "DECIMAL", "DURATION"]),
    })
    .safeParse({
      slug: formData.get("slug"),
      name: formData.get("name"),
      unit: formData.get("unit") ?? "",
      kind: formData.get("kind"),
      input: formData.get("input"),
    });
  if (!parsed.success) return { ok: false, error: firstError(parsed.error, copy.err.check) };

  const found = await membership(parsed.data.slug, user.id);
  if (!found || found.member.role !== "OWNER") {
    return { ok: false, error: copy.err.ownerOnly };
  }

  const base = metricSlug(parsed.data.name);
  const taken = new Set(found.challenge.metrics.map((metric) => metric.slug));
  let slug = base;
  let n = 2;
  while (taken.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  const sortOrder =
    Math.max(-1, ...found.challenge.metrics.map((metric) => metric.sortOrder)) + 1;

  await prisma.metric.create({
    data: {
      challengeId: found.challenge.id,
      name: parsed.data.name,
      slug,
      unit: parsed.data.unit,
      kind: parsed.data.kind as MetricKind,
      input: parsed.data.input as MetricInput,
      higherIsBetter: parsed.data.input !== "DURATION",
      sortOrder,
    },
  });
  refresh(parsed.data.slug);
  return { ok: true, message: fill(copy.ok.trackerAdded, { name: parsed.data.name }) };
}

export async function removeMetric(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const metricId = String(formData.get("metricId") ?? "");
  const found = await membership(slug, user.id);
  if (!found || found.member.role !== "OWNER") return;
  if (found.challenge.metrics.length <= 1) return;
  await prisma.metric.deleteMany({
    where: { id: metricId, challengeId: found.challenge.id },
  });
  refresh(slug);
}

export async function rotateInvite(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const found = await membership(slug, user.id);
  if (!found || found.member.role !== "OWNER") return;
  await prisma.challenge.update({
    where: { id: found.challenge.id },
    data: { inviteCode: inviteCode() },
  });
  refresh(slug);
}

export async function removeMember(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const memberId = String(formData.get("memberId") ?? "");
  const found = await membership(slug, user.id);
  if (!found || found.member.role !== "OWNER") return;
  const target = found.challenge.members.find((member) => member.id === memberId);
  if (!target || target.userId === user.id || target.role === "OWNER") return;
  await prisma.challengeMember.delete({ where: { id: target.id } });
  refresh(slug);
}

export async function leaveChallenge(formData: FormData) {
  const user = await requireUser();
  const slug = String(formData.get("slug") ?? "");
  const found = await membership(slug, user.id);
  if (!found) redirect("/home");

  const others = found.challenge.members.filter((member) => member.userId !== user.id);
  if (others.length === 0) {
    await prisma.challenge.delete({ where: { id: found.challenge.id } });
    revalidatePath("/home");
    redirect("/home");
  }

  if (found.member.role === "OWNER") {
    const nextOwner = [...others].sort(
      (a, b) => a.joinedAt.getTime() - b.joinedAt.getTime(),
    )[0];
    await prisma.challengeMember.update({
      where: { id: nextOwner.id },
      data: { role: "OWNER" },
    });
  }

  await prisma.challengeMember.delete({ where: { id: found.member.id } });
  revalidatePath("/home");
  redirect("/home");
}
