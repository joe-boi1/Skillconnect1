"use client";

import { useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { addPortfolioItem } from "@/lib/actions/portfolio";

export function PortfolioUploadForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [resetKey, setResetKey] = useState(0);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addPortfolioItem(formData);
      if (result.ok) {
        formRef.current?.reset();
        setResetKey((k) => k + 1); // remounts ImageUpload so its preview clears too
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Card>
      <h3 className="mb-3 font-display text-base font-semibold text-ink">Upload work</h3>
      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <ImageUpload key={resetKey} name="imageUrl" label="Photo" />
        <Input name="title" label="Project title" placeholder="e.g. Kitchen rewiring" required />
        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="What did the job involve?"
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>
        <Input name="projectDate" label="Date" type="date" />
        {error && <p role="alert" className="text-sm text-coral-500">{error}</p>}
        <Button type="submit" className="w-full" isLoading={isPending}>
          Add to portfolio
        </Button>
      </form>
    </Card>
  );
}
