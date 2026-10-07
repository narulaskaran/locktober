import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";
import { Wordmark } from "@/components/wordmark";
import { getVoice } from "@/lib/voice";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SignUpCopy />
    </Suspense>
  );
}

async function SignUpCopy() {
  const { copy } = await getVoice();
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
      <Wordmark />
      <h1 className="mt-10 font-serif text-4xl">{copy.auth.signUpTitle}</h1>
      <p className="mt-2 text-sm text-ink-soft">{copy.auth.signUpBody}</p>
      <div className="mt-6">
        <SignUp fallbackRedirectUrl="/home" />
      </div>
    </main>
  );
}
