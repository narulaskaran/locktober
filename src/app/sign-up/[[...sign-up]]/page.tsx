import { SignUp } from "@clerk/nextjs";
import { Wordmark } from "@/components/wordmark";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
      <Wordmark />
      <h1 className="mt-10 font-serif text-4xl">Make an account</h1>
      <p className="mt-2 text-sm text-ink-soft">
        You only need this once. An invite link drops you onto a board after.
      </p>
      <div className="mt-6">
        <SignUp fallbackRedirectUrl="/home" />
      </div>
    </main>
  );
}
