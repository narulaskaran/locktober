import Link from "next/link";
import { Pumpkin } from "@/components/pumpkin";
import { Wordmark } from "@/components/wordmark";
import { btnInk } from "@/lib/styles";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5">
      <Wordmark />
      <Pumpkin size={72} className="mt-10" />
      <h1 className="mt-6 font-serif text-5xl">That page is not on the board.</h1>
      <p className="mt-3 text-ink-soft">The link may be old, or the board may have been deleted.</p>
      <Link href="/" className={`${btnInk} mt-6 self-start`}>
        Back home
      </Link>
    </main>
  );
}
