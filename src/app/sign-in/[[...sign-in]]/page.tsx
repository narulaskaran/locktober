import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";
import { Wordmark } from "@/components/wordmark";
import { getVoice } from "@/lib/voice";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SignInCopy />
    </Suspense>
  );
}

async function SignInCopy() {
  const { copy } = await getVoice();
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
      <Wordmark />
      <h1 className="mt-10 font-serif text-4xl">{copy.auth.signInTitle}</h1>
      <p className="mt-2 text-sm text-ink-soft">{copy.auth.signInBody}</p>
      <div className="mt-6">
        <SignIn fallbackRedirectUrl="/home" />
      </div>
    </main>
  );
}
