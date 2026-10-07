import type { MetricInput, MetricKind } from "@/generated/prisma/client";

export type TemplateMetric = {
  name: string;
  unit: string;
  kind: MetricKind;
  input: MetricInput;
  higherIsBetter: boolean;
};

export type TemplateId = "pushups" | "grind" | "presidential";

export type ChallengeTemplate = {
  id: TemplateId;
  metrics: readonly TemplateMetric[];
};

// Picker titles and blurbs live in src/lib/copy.ts so Minion mode can translate them.
export const templates: readonly ChallengeTemplate[] = [
  {
    id: "pushups",
    metrics: [
      {
        name: "Push-ups",
        unit: "reps",
        kind: "DAILY",
        input: "COUNT",
        higherIsBetter: true,
      },
      {
        name: "Max push-ups",
        unit: "reps",
        kind: "FINALE",
        input: "COUNT",
        higherIsBetter: true,
      },
    ],
  },
  {
    id: "grind",
    metrics: [
      {
        name: "Push-ups",
        unit: "reps",
        kind: "DAILY",
        input: "COUNT",
        higherIsBetter: true,
      },
      {
        name: "Pull-ups",
        unit: "reps",
        kind: "DAILY",
        input: "COUNT",
        higherIsBetter: true,
      },
      {
        name: "Miles",
        unit: "mi",
        kind: "DAILY",
        input: "DECIMAL",
        higherIsBetter: true,
      },
      {
        name: "Max push-ups",
        unit: "reps",
        kind: "FINALE",
        input: "COUNT",
        higherIsBetter: true,
      },
    ],
  },
  {
    id: "presidential",
    metrics: [
      {
        name: "Push-ups",
        unit: "reps",
        kind: "DAILY",
        input: "COUNT",
        higherIsBetter: true,
      },
      {
        name: "Max push-ups",
        unit: "reps",
        kind: "FINALE",
        input: "COUNT",
        higherIsBetter: true,
      },
      {
        name: "Sit-ups in 60s",
        unit: "reps",
        kind: "FINALE",
        input: "COUNT",
        higherIsBetter: true,
      },
      {
        name: "Pull-ups",
        unit: "reps",
        kind: "FINALE",
        input: "COUNT",
        higherIsBetter: true,
      },
      {
        name: "Mile",
        unit: "time",
        kind: "FINALE",
        input: "DURATION",
        higherIsBetter: false,
      },
    ],
  },
];

export function templateById(id: string) {
  return templates.find((template) => template.id === id) ?? templates[0]!;
}
