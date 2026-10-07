export function todayISO(timeZone: string, now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDays(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function eachDay(start: string, end: string) {
  const days: string[] = [];
  for (let day = start; day <= end; day = addDays(day, 1)) {
    days.push(day);
  }
  return days;
}

export function asDbDate(iso: string) {
  return new Date(`${iso}T00:00:00.000Z`);
}

export function fromDbDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatDay(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatRange(start: string, end: string) {
  const startLabel = formatDay(start).replace(/^[A-Za-z]{3}, /, "");
  const endLabel = formatDay(end).replace(/^[A-Za-z]{3}, /, "");
  return `${startLabel} – ${endLabel}`;
}

export function defaultWindow(timeZone = "America/New_York") {
  const today = todayISO(timeZone);
  const [year, month] = today.split("-");
  const last = new Date(Date.UTC(Number(year), Number(month), 0)).getUTCDate();
  return {
    start: `${year}-${month}-01`,
    end: `${year}-${month}-${String(last).padStart(2, "0")}`,
  };
}

export function daysBetween(start: string, end: string) {
  return eachDay(start, end).length;
}
