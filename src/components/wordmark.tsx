import Link from "next/link";
import { Pumpkin } from "@/components/pumpkin";

export function Wordmark({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center gap-2">
      <Pumpkin size={26} />
      <span className="font-serif text-2xl leading-none italic tracking-tight">Loctober</span>
      <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-ink-soft sm:inline">
        the board
      </span>
    </Link>
  );
}
