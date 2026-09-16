"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    setIsLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });
    setIsLoading(false);

    if (!res.ok) {
      setError("Something went wrong. Try again.");
      return;
    }
    setSent(true);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-6 py-10">
      <p className="font-display text-xl font-semibold text-brand-600">SkillConnect</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Reset your password</h1>

      {sent ? (
        <p className="mt-4 text-sm text-ink/70">
          If an account exists for that email, we&apos;ve sent a link to reset your password.
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm text-ink/60">
            Enter your email and we&apos;ll send you a reset link.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <Input label="Email" name="email" type="email" autoComplete="email" required />
            {error && <p role="alert" className="text-sm text-coral-500">{error}</p>}
            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Send reset link
            </Button>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-sm text-ink/60">
        <Link href="/login" className="font-medium text-brand-600">Back to log in</Link>
      </p>
    </main>
  );
}
