import Link from "next/link";
import { Suspense } from "react";
import { Wordmark } from "@/components/wordmark";
import { btnInk } from "@/lib/styles";
import { getVoice } from "@/lib/voice";

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Missing />
    </Suspense>
  );
}

async function Missing() {
  const { copy } = await getVoice();
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5">
      <Wordmark />
      <h1 className="mt-8 font-serif text-5xl">{copy.missing.title}</h1>
      <p className="mt-3 text-ink-soft">{copy.missing.body}</p>
      <Link href="/" className={`${btnInk} mt-6 self-start`}>
        {copy.missing.home}
      </Link>
    </main>
  );
}
