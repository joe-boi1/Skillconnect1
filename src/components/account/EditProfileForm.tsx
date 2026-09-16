"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { updateCustomerProfile } from "@/lib/actions/profile";

type Props = {
  fullName: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
};

export function EditProfileForm({ fullName, email, phone, city, state, address }: Props) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("saving");
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = await updateCustomerProfile(formData);
    if (result.ok) {
      setStatus("saved");
    } else {
      setStatus("error");
      setError(result.error);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Full name" name="fullName" defaultValue={fullName} required />
        <Input label="Email" name="email" type="email" defaultValue={email} disabled hint="Contact support to change your email" />
        <Input label="Phone number" name="phone" type="tel" defaultValue={phone ?? ""} required />
        <Input label="City" name="city" defaultValue={city ?? ""} placeholder="e.g. Lagos" />
        <Input label="State" name="state" defaultValue={state ?? ""} placeholder="e.g. Lagos" />
        <Input label="Address" name="address" defaultValue={address ?? ""} placeholder="Street address" />

        {error && <p role="alert" className="text-sm text-coral-500">{error}</p>}
        {status === "saved" && <p className="text-sm text-brand-600">Saved.</p>}

        <Button type="submit" isLoading={status === "saving"}>
          Save changes
        </Button>
      </form>
    </Card>
  );
}
