import Link from "next/link";
import { Suspense } from "react";
import { CreateForm } from "@/components/create-form";
import { Wordmark } from "@/components/wordmark";
import { defaultWindow } from "@/lib/dates";

export const metadata = { title: "New board" };

export default function NewChallengePage() {
  const { start, end } = defaultWindow();
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
        <Suspense>
          <CreateForm start={start} end={end} />
        </Suspense>
      </div>
    </div>
  );
}
