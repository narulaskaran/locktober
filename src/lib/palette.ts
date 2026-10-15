// Series colors for charts. Your own line is always the theme's accent;
// everyone else gets a stable color by the order they joined. The first, third,
// and sixth follow the theme; the rest are fixed so lines stay distinct in
// every month. All are dark enough to read on paper.
const others = [
  "var(--ink)",
  "var(--moss)",
  "#2f5d8a",
  "#a56b12",
  "#7a3b73",
  "var(--ink-soft)",
  "#8d1d1d",
];

export function memberColor(index: number, isYou: boolean) {
  return isYou ? "var(--ember)" : others[index % others.length];
}
