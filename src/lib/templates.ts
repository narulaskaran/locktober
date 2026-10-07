import type { MetricInput, MetricKind } from "@/generated/prisma/client";

export type TemplateMetric = {
  name: string;
  unit: string;
  kind: MetricKind;
  input: MetricInput;
  higherIsBetter: boolean;
};

export type ChallengeTemplate = {
  id: string;
  name: string;
  blurb: string;
  metrics: TemplateMetric[];
};

export const templates: ChallengeTemplate[] = [
  {
    id: "pushups",
    name: "Push-up month",
    blurb: "Log push-ups every day. On the last stretch, one max set.",
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
    name: "The whole grind",
    blurb: "Push-ups, pull-ups, and miles, then a max set of push-ups.",
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
    name: "Presidential",
    blurb: "Daily push-ups, then the test: push-ups, sit-ups, pull-ups, and a mile.",
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
  return templates.find((template) => template.id === id) ?? templates[0];
}
