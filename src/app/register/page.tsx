"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { RoleSelect } from "@/components/auth/RoleSelect";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"CUSTOMER" | "ARTISAN" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!role) {
      setError("Choose what you're here to do");
      return;
    }

    const form = new FormData(e.currentTarget);
    const payload = {
      fullName: form.get("fullName"),
      email: form.get("email"),
      phone: form.get("phone"),
      password: form.get("password"),
      role,
    };

    setIsLoading(true);
    const res = await fetch("/api/auth/register", {
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

    router.push(role === "CUSTOMER" ? "/customer/home" : "/artisan/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-6 py-10">
      <p className="font-display text-xl font-semibold text-brand-600">SkillConnect</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Create your account</h1>
      <p className="mt-1 text-sm text-ink/60">It only takes a minute.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <RoleSelect value={role} onChange={setRole} />
        <Input label="Full name" name="fullName" autoComplete="name" required />
        <Input label="Email" name="email" type="email" autoComplete="email" required />
        <Input
          label="Phone number"
          name="phone"
          type="tel"
          placeholder="0803 123 4567"
          autoComplete="tel"
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters"
          required
        />

        {error && (
          <p role="alert" className="text-sm text-coral-500">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand-600">
          Log in
        </Link>
      </p>
    </main>
  );
}
