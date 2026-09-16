import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { db } from "@/lib/db";
import { searchArtisans } from "@/lib/artisans";
import { categoryIcon } from "@/lib/categoryIcons";
import { ArtisanCard } from "@/components/artisan/ArtisanCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { clsx } from "@/lib/clsx";

// A plain GET form + searchParams keeps this filterable and shareable by
// URL without any client-side state — the results are always exactly what
// the database returns for the current query string.
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const activeCategory = searchParams.category ?? "";
  const query = searchParams.q ?? "";

  const [categories, results] = await Promise.all([
    db.serviceCategory.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    searchArtisans({ categorySlug: activeCategory || undefined, query: query || undefined }),
  ]);

  return (
    <div className="space-y-5">
      <form action="/customer/search" method="get" className="flex h-12 items-center gap-2.5 rounded-xl border border-line bg-white px-4">
        <SearchIcon size={18} className="text-ink/40" />
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="What service do you need?"
          className="h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink/40"
        />
        {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
      </form>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link
          href={query ? `/customer/search?q=${encodeURIComponent(query)}` : "/customer/search"}
          className={clsx(
            "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium",
            !activeCategory ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line bg-white text-ink/60"
          )}
        >
          All
        </Link>
        {categories.map((c) => {
          const Icon = categoryIcon(c.iconName);
          const href = `/customer/search?category=${c.slug}${query ? `&q=${encodeURIComponent(query)}` : ""}`;
          const active = activeCategory === c.slug;
          return (
            <Link
              key={c.id}
              href={href}
              className={clsx(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium",
                active ? "border-brand-500 bg-brand-50 text-brand-700" : "border-line bg-white text-ink/60"
              )}
            >
              <Icon size={14} />
              {c.name}
            </Link>
          );
        })}
      </div>

      <div>
        <p className="mb-3 text-sm text-ink/50">
          {results.length} {results.length === 1 ? "artisan" : "artisans"} found
        </p>
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((a) => (
              <ArtisanCard key={a.id} artisan={a} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matches"
            body="Try a different category or search term."
          />
        )}
      </div>
    </div>
  );
}
