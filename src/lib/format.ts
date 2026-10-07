import type { MetricInput } from "@/generated/prisma/client";

export function formatValue(value: number, input: MetricInput) {
  if (input === "DURATION") {
    const total = Math.max(0, Math.round(value));
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  if (input === "DECIMAL") {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 1,
      minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Math.round(value),
  );
}

export function formatValueWithUnit(
  value: number,
  input: MetricInput,
  unit: string,
) {
  const formatted = formatValue(value, input);
  if (input === "DURATION" || !unit) return formatted;
  return `${formatted} ${unit}`;
}

export function displayName(name: string, nickname?: string | null, fallback = "Athlete") {
  const trimmed = nickname?.trim();
  if (trimmed) return trimmed;
  const first = name.trim().split(/\s+/)[0];
  return first || fallback;
}

export function ordinal(
  rank: number,
  suffix: { st: string; nd: string; rd: string; th: string },
) {
  const mod = rank % 100;
  if (mod >= 11 && mod <= 13) return `${rank}${suffix.th}`;
  switch (rank % 10) {
    case 1:
      return `${rank}${suffix.st}`;
    case 2:
      return `${rank}${suffix.nd}`;
    case 3:
      return `${rank}${suffix.rd}`;
    default:
      return `${rank}${suffix.th}`;
  }
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return (letters || "L").toUpperCase();
}
