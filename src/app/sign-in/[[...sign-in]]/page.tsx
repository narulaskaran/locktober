import { SignIn } from "@clerk/nextjs";
import { Wordmark } from "@/components/wordmark";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-8">
      <Wordmark />
      <h1 className="mt-10 font-serif text-4xl">Sign in</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Google is the fast way in. Email works too, if that is what you have.
      </p>
      <div className="mt-6">
        <SignIn fallbackRedirectUrl="/home" />
      </div>
    </main>
  );
}
