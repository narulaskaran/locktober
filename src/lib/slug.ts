import { randomBytes } from "node:crypto";

const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";

export function slugify(name: string) {
  const base =
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "challenge";
  return `${base}-${randomBytes(2).toString("hex")}`;
}

export function metricSlug(name: string) {
  return (
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "metric"
  );
}

export function inviteCode() {
  const bytes = randomBytes(10);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}
