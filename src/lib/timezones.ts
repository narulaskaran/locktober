export const timezones = [
  { value: "America/Los_Angeles", label: "Pacific" },
  { value: "America/Denver", label: "Mountain" },
  { value: "America/Phoenix", label: "Arizona" },
  { value: "America/Chicago", label: "Central" },
  { value: "America/New_York", label: "Eastern" },
  { value: "Pacific/Honolulu", label: "Hawaii" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Paris", label: "Central Europe" },
  { value: "Asia/Kolkata", label: "India" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Australia/Sydney", label: "Sydney" },
  { value: "UTC", label: "UTC" },
] as const;

export function timezoneLabel(value: string) {
  return timezones.find((zone) => zone.value === value)?.label ?? value;
}
