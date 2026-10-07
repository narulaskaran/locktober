// Series colors for charts. Your own line is always ember; everyone else gets
// a stable color by the order they joined, all dark enough to read on paper.
const others = ["#1c1712", "#215c38", "#2f5d8a", "#a56b12", "#7a3b73", "#5e564c", "#8d1d1d"];

export function memberColor(index: number, isYou: boolean) {
  return isYou ? "#e23b14" : others[index % others.length];
}
