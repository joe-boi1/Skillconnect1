"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { updateArtisanProfile } from "@/lib/actions/artisanProfile";

type Props = {
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  businessName: string | null;
  profession: string | null;
  bio: string | null;
  yearsExperience: number | null;
  city: string | null;
  state: string | null;
  serviceArea: string | null;
};

export function EditArtisanProfileForm(props: Props) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setStatus("saving");
    setError(null);
    startTransition(async () => {
      const result = await updateArtisanProfile(formData);
      if (result.ok) {
        setStatus("saved");
      } else {
        setStatus("error");
        setError(result.error);
      }
    });
  }

  return (
    <Card>
      <form action={handleSubmit} className="space-y-4">
        <ImageUpload name="avatarUrl" label="Profile photo" defaultValue={props.avatarUrl} shape="circle" />
        <Input label="Full name" name="fullName" defaultValue={props.fullName} required />
        <Input label="Phone number" name="phone" type="tel" defaultValue={props.phone ?? ""} required />
        <Input label="Business name" name="businessName" defaultValue={props.businessName ?? ""} placeholder="e.g. Chidi Electricals" />
        <Input label="Profession" name="profession" defaultValue={props.profession ?? ""} placeholder="e.g. Electrician" />

        <div>
          <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-ink">
            Biography
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={props.bio ?? ""}
            placeholder="Tell customers about your experience and specialties"
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>

        <Input
          label="Years of experience"
          name="yearsExperience"
          type="number"
          min="0"
          defaultValue={props.yearsExperience ?? ""}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input label="City" name="city" defaultValue={props.city ?? ""} placeholder="e.g. Lagos" />
          <Input label="State" name="state" defaultValue={props.state ?? ""} placeholder="e.g. Lagos" />
        </div>

        <Input
          label="Service area"
          name="serviceArea"
          defaultValue={props.serviceArea ?? ""}
          placeholder="e.g. Lagos Mainland, Ikeja, Yaba"
          hint="Areas you're willing to travel to for jobs"
        />

        {error && <p role="alert" className="text-sm text-coral-500">{error}</p>}
        {status === "saved" && <p className="text-sm text-brand-600">Saved.</p>}

        <Button type="submit" className="w-full" isLoading={isPending}>
          Save changes
        </Button>
      </form>
    </Card>
  );
}
