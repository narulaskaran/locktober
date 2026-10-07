import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { CreateForm } from "@/components/create-form";
import { Wordmark } from "@/components/wordmark";
import { requireUser } from "@/lib/auth";
import { defaultWindow } from "@/lib/dates";

export const metadata = { title: "New board" };

export default function NewChallengePage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-xl px-5 py-5">
      <Wordmark href="/home" />
      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl leading-none">New board</h1>
          <p className="mt-2 text-sm text-ink-soft">
            You can add steps, miles, or another finale event after this.
          </p>
        </div>
        <Link href="/home" className="text-sm underline">
          Cancel
        </Link>
      </div>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-ink-soft">Setting the month…</p>}>
          <NewChallengeForm />
        </Suspense>
      </div>
    </div>
  );
}

async function NewChallengeForm() {
  await connection();
  await requireUser("/challenges/new");
  const { start, end } = defaultWindow();
  return <CreateForm start={start} end={end} />;
}
