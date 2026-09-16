"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = { email: form.get("email"), password: form.get("password") };

    setIsLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setIsLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }

    const next = searchParams.get("next");
    const fallback =
      data.user.role === "CUSTOMER"
        ? "/customer/home"
        : data.user.role === "ARTISAN"
        ? "/artisan/dashboard"
        : "/admin/dashboard";

    router.push(next ?? fallback);
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-6 py-10">
      <p className="font-display text-xl font-semibold text-brand-600">SkillConnect</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-ink/60">Log in to continue.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <Input label="Email" name="email" type="email" autoComplete="email" required />
        <Input label="Password" name="password" type="password" autoComplete="current-password" required />

        {error && (
          <p role="alert" className="text-sm text-coral-500">
            {error}
          </p>
        )}

        <div className="text-right">
          <Link href="/forgot-password" className="text-sm font-medium text-brand-600">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        New to SkillConnect?{" "}
        <Link href="/register" className="font-medium text-brand-600">
          Create an account
        </Link>
      </p>
    </main>
  );
}
