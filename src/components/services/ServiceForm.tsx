"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createService, updateService } from "@/lib/actions/services";

type Category = { id: string; name: string };

type Defaults = {
  title: string;
  categoryId: string;
  description: string;
  priceMin: number | null;
  priceMax: number | null;
  priceUnit: string;
  estimatedDuration: string | null;
};

export function ServiceForm({
  categories,
  serviceId,
  defaults,
}: {
  categories: Category[];
  serviceId?: string;
  defaults?: Defaults;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = serviceId
        ? await updateService(serviceId, formData)
        : await createService(formData);
      // On success both actions redirect server-side and never return here.
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <Card>
      <form action={handleSubmit} className="space-y-4">
        <Input label="Service name" name="title" defaultValue={defaults?.title} required placeholder="e.g. Home wiring & electrical repair" />

        <div>
          <label htmlFor="categoryId" className="mb-1.5 block text-sm font-medium text-ink">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={defaults?.categoryId ?? ""}
            className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <option value="" disabled>
              Choose a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            defaultValue={defaults?.description}
            placeholder="What's included in this service?"
            className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Starting price (₦)"
            name="priceMin"
            type="number"
            min="0"
            defaultValue={defaults?.priceMin ?? ""}
            placeholder="5000"
          />
          <Input
            label="Maximum price (₦)"
            name="priceMax"
            type="number"
            min="0"
            defaultValue={defaults?.priceMax ?? ""}
            placeholder="25000"
          />
        </div>

        <div>
          <label htmlFor="priceUnit" className="mb-1.5 block text-sm font-medium text-ink">
            Price basis
          </label>
          <select
            id="priceUnit"
            name="priceUnit"
            defaultValue={defaults?.priceUnit ?? "per job"}
            className="h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <option value="per job">Per job</option>
            <option value="per hour">Per hour</option>
            <option value="per day">Per day</option>
          </select>
        </div>

        <Input
          label="Estimated duration"
          name="estimatedDuration"
          defaultValue={defaults?.estimatedDuration ?? ""}
          placeholder="e.g. 2 hours, 1 day"
        />

        {error && <p role="alert" className="text-sm text-coral-500">{error}</p>}

        <Button type="submit" className="w-full" isLoading={isPending}>
          {serviceId ? "Save changes" : "Add service"}
        </Button>
      </form>
    </Card>
  );
}
