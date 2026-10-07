import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { CreateForm } from "@/components/create-form";
import { Wordmark } from "@/components/wordmark";
import { requireUser } from "@/lib/auth";
import { defaultWindow } from "@/lib/dates";
import { getVoice } from "@/lib/voice";

export async function generateMetadata(): Promise<Metadata> {
  const { copy } = await getVoice();
  return { title: copy.create.title };
}

export default function NewChallengePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <NewChallenge />
    </Suspense>
  );
}

async function NewChallenge() {
  const { copy } = await getVoice();
  return (
    <div className="mx-auto min-h-screen w-full max-w-xl px-5 py-5">
      <Wordmark href="/home" />
      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl leading-none">{copy.create.title}</h1>
          <p className="mt-2 text-sm text-ink-soft">{copy.create.blurb}</p>
        </div>
        <Link href="/home" className="text-sm underline">
          {copy.create.cancel}
        </Link>
      </div>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-ink-soft">{copy.create.setting}</p>}>
          <NewChallengeForm />
        </Suspense>
      </div>
    </div>
  );
}

async function NewChallengeForm() {
  await connection();
  await requireUser();
  const { start, end } = defaultWindow();
  return <CreateForm start={start} end={end} />;
}
