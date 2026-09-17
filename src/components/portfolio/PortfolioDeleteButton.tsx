"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deletePortfolioItem } from "@/lib/actions/portfolio";

export function PortfolioDeleteButton({ itemId }: { itemId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Remove this portfolio item?")) {
          startTransition(() => deletePortfolioItem(itemId));
        }
      }}
      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-coral-500 shadow-card disabled:opacity-50"
      aria-label="Delete"
    >
      <Trash2 size={14} />
    </button>
  );
}
