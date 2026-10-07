import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import type { MetricInput } from "@/generated/prisma/client";
import { requireUser } from "@/lib/auth";
import { addDays, eachDay, fromDbDate, todayISO } from "@/lib/dates";
import { prisma } from "@/lib/prisma";

export type BoardMember = {
  id: string;
  userId: string;
  name: string;
  nickname: string | null;
  imageUrl: string | null;
  role: "OWNER" | "MEMBER";
  isYou: boolean;
};

export type RankedRow = {
  member: BoardMember;
  value: number | null;
  total: number;
  streak: number;
  byDay: Record<string, number>;
};

function toMember(
  member: {
    id: string;
    userId: string;
    nickname: string | null;
    role: "OWNER" | "MEMBER";
    user: { name: string; imageUrl: string | null };
  },
  userId: string,
): BoardMember {
  return {
    id: member.id,
    userId: member.userId,
    name: member.user.name,
    nickname: member.nickname,
    imageUrl: member.user.imageUrl,
    role: member.role,
    isYou: member.userId === userId,
  };
}

export const getChallengeContext = cache(async (slug: string) => {
  const user = await requireUser();
  const challenge = await prisma.challenge.findUnique({
    where: { slug },
    include: {
      metrics: { orderBy: [{ kind: "asc" }, { sortOrder: "asc" }] },
      members: {
        include: { user: true },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!challenge) notFound();

  const membership = challenge.members.find((member) => member.userId === user.id);
  if (!membership) redirect("/home?notice=not-on-board");

  return {
    user,
    membership,
    challenge: {
      ...challenge,
      startDate: fromDbDate(challenge.startDate),
      endDate: fromDbDate(challenge.endDate),
    },
    members: challenge.members.map((member) => toMember(member, user.id)),
  };
});

function rankRows(
  rows: RankedRow[],
  higherIsBetter: boolean,
): Array<RankedRow & { rank: number | null }> {
  const logged = rows
    .filter((row) => row.value !== null)
    .sort((a, b) => {
      const diff = higherIsBetter ? b.value! - a.value! : a.value! - b.value!;
      if (diff !== 0) return diff;
      return a.member.name.localeCompare(b.member.name);
    });
  const missing = rows
    .filter((row) => row.value === null)
    .sort((a, b) => a.member.name.localeCompare(b.member.name));

  let lastValue: number | null = null;
  let lastRank = 0;
  const ranked = logged.map((row, index) => {
    if (lastValue === null || row.value !== lastValue) {
      lastRank = index + 1;
      lastValue = row.value;
    }
    return { ...row, rank: lastRank };
  });

  return [...ranked, ...missing.map((row) => ({ ...row, rank: null }))];
}

export async function loadDailyBoard(slug: string, metricSlug: string | undefined, focusDate?: string) {
  const { challenge, members, user } = await getChallengeContext(slug);
  const pool = challenge.metrics.filter((metric) => metric.kind === "DAILY");
  const metric = pool.find((item) => item.slug === metricSlug) ?? pool[0] ?? null;
  const today = todayISO(challenge.timezone);
  const days = eachDay(challenge.startDate, challenge.endDate);
  const date = pickDate(focusDate, challenge.startDate, challenge.endDate, today);

  if (!metric) {
    return { metric: null, days, today, date, rows: [] as RankedRow[], you: undefined };
  }

  const entries = await prisma.entry.findMany({
    where: {
      metricId: metric.id,
      date: {
        gte: new Date(`${challenge.startDate}T00:00:00.000Z`),
        lte: new Date(`${challenge.endDate}T00:00:00.000Z`),
      },
    },
  });

  const rows = members.map((member) => {
    const byDay: Record<string, number> = {};
    let total = 0;
    for (const entry of entries) {
      if (entry.userId !== member.userId) continue;
      const iso = fromDbDate(entry.date);
      byDay[iso] = entry.value;
      total += entry.value;
    }
    return {
      member,
      value: Object.hasOwn(byDay, date) ? byDay[date] : null,
      total,
      streak: streakFor(byDay, days, today),
      byDay,
    };
  });

  return {
    metric,
    days,
    today,
    date,
    rows,
    you: rows.find((row) => row.member.userId === user.id),
  };
}

export async function loadFinaleBoard(slug: string) {
  const { challenge, members, user } = await getChallengeContext(slug);
  const metrics = challenge.metrics.filter((metric) => metric.kind === "FINALE");
  const today = todayISO(challenge.timezone);
  const entries = metrics.length
    ? await prisma.finaleEntry.findMany({
        where: { metricId: { in: metrics.map((metric) => metric.id) } },
      })
    : [];

  const events = metrics.map((metric) => {
    const rows = members.map((member) => {
      const entry = entries.find(
        (item) => item.metricId === metric.id && item.userId === member.userId,
      );
      return {
        member,
        value: entry?.value ?? null,
        total: entry?.value ?? 0,
        streak: 0,
        byDay: {},
      };
    });
    return {
      metric,
      ranked: rankRows(rows, metric.higherIsBetter),
      you: rows.find((row) => row.member.userId === user.id),
    };
  });

  return { metrics, events, today, open: finaleOpen(challenge.startDate, challenge.endDate, today) };
}

function finaleOpen(start: string, end: string, today: string) {
  return today >= start && today <= addDays(end, 3);
}

function streakFor(byDay: Record<string, number>, days: string[], today: string) {
  if (days.length === 0 || today < days[0]) return 0;
  const last = today > days[days.length - 1] ? days[days.length - 1] : today;
  const cursor = Object.hasOwn(byDay, last) ? last : addDays(last, -1);
  let streak = 0;
  for (let day = cursor; day >= days[0]; day = addDays(day, -1)) {
    const value = byDay[day];
    if (value === undefined || value <= 0) break;
    streak += 1;
  }
  return streak;
}

export function rankBy(
  rows: RankedRow[],
  higherIsBetter: boolean,
  field: "value" | "total",
) {
  const source = rows.map((row) =>
    field === "total" ? { ...row, value: row.total } : row,
  );
  return rankRows(source, higherIsBetter).map((row, index) => ({
    ...rows.find((item) => item.member.userId === row.member.userId)!,
    rank: row.rank,
    sortIndex: index,
  }));
}

export function pickDate(requested: string | undefined, start: string, end: string, today: string) {
  const cappedToday = today < start ? start : today > end ? end : today;
  if (!requested || !/^\d{4}-\d{2}-\d{2}$/.test(requested)) return cappedToday;
  if (requested < start || requested > end || requested > today) return cappedToday;
  return requested;
}

export async function loadHome() {
  const user = await requireUser();
  const memberships = await prisma.challengeMember.findMany({
    where: { userId: user.id },
    include: {
      challenge: {
        include: {
          metrics: { orderBy: { sortOrder: "asc" } },
          _count: { select: { members: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  const dailyMetricIds = memberships.flatMap((membership) =>
    membership.challenge.metrics
      .filter((metric) => metric.kind === "DAILY")
      .slice(0, 1)
      .map((metric) => metric.id),
  );

  const entries = dailyMetricIds.length
    ? await prisma.entry.findMany({
        where: { userId: user.id, metricId: { in: dailyMetricIds } },
      })
    : [];

  const cards = memberships.map((membership) => {
    const challenge = membership.challenge;
    const start = fromDbDate(challenge.startDate);
    const end = fromDbDate(challenge.endDate);
    const today = todayISO(challenge.timezone);
    const metric = challenge.metrics.find((item) => item.kind === "DAILY") ?? null;
    const mine = entries.filter((entry) => entry.metricId === metric?.id);
    const todayEntry = mine.find((entry) => fromDbDate(entry.date) === today);
    const monthTotal = mine.reduce((sum, entry) => {
      const iso = fromDbDate(entry.date);
      if (iso < start || iso > end) return sum;
      return sum + entry.value;
    }, 0);

    return {
      slug: challenge.slug,
      name: challenge.name,
      start,
      end,
      timezone: challenge.timezone,
      members: challenge._count.members,
      role: membership.role,
      metricName: metric?.name ?? null,
      metricUnit: metric?.unit ?? "",
      metricInput: metric?.input ?? ("COUNT" as MetricInput),
      todayValue: todayEntry?.value ?? null,
      monthTotal,
      loggedToday: Boolean(todayEntry),
    };
  });

  return { user, cards };
}
