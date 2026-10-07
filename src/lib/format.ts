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

export function displayName(name: string, nickname?: string | null) {
  const trimmed = nickname?.trim();
  if (trimmed) return trimmed;
  const first = name.trim().split(/\s+/)[0];
  return first || "Athlete";
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
  return (letters || "L").toUpperCase();
}
