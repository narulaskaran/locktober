import Image from "next/image";
import { initials } from "@/lib/format";

export function Avatar({
  name,
  imageUrl,
  size = 36,
}: {
  name: string;
  imageUrl?: string | null;
  size?: number;
}) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt=""
        width={size}
        height={size}
        className="shrink-0 border border-ink object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center border border-ink bg-paper font-serif text-sm"
      style={{ width: size, height: size }}
    >
      {initials(name)}
    </span>
  );
}
