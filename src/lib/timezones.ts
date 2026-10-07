export const timezones = [
  { value: "America/Los_Angeles", voice: "pacific" },
  { value: "America/Denver", voice: "mountain" },
  { value: "America/Phoenix", voice: "arizona" },
  { value: "America/Chicago", voice: "central" },
  { value: "America/New_York", voice: "eastern" },
  { value: "Pacific/Honolulu", voice: "hawaii" },
  { value: "Europe/London", voice: "london" },
  { value: "Europe/Paris", voice: "europe" },
  { value: "Asia/Kolkata", voice: "india" },
  { value: "Asia/Tokyo", voice: "tokyo" },
  { value: "Australia/Sydney", voice: "sydney" },
  { value: "UTC", voice: "utc" },
] as const;

export type TimezoneVoice = (typeof timezones)[number]["voice"];

export function timezoneLabel(value: string, labels: Record<TimezoneVoice, string>) {
  const zone = timezones.find((item) => item.value === value);
  if (!zone) return value;
  return labels[zone.voice];
}
