import Link from "next/link";
import { Bell, MapPin, Search as SearchIcon } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { getRecommendedArtisans } from "@/lib/artisans";
import { categoryIcon } from "@/lib/categoryIcons";
import { ArtisanCard } from "@/components/artisan/ArtisanCard";
import { EmptyState } from "@/components/ui/EmptyState";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function CustomerHomePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [categories, recommended, unreadCount] = await Promise.all([
    db.serviceCategory.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    getRecommendedArtisans(6),
    db.notification.count({ where: { userId: user.id, readAt: null } }),
  ]);

  const firstName = user.fullName.split(" ")[0];
  const location = [user.customerProfile?.city, user.customerProfile?.state]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      {/* Greeting + location + notifications */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">
            {greeting()}, {firstName}
          </h1>
          <Link
            href="/customer/account/edit"
            className="mt-0.5 flex items-center gap-1 text-sm text-ink/60"
          >
            <MapPin size={14} />
            {location || "Set your location"}
          </Link>
        </div>
        <Link
          href="/customer/notifications"
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white"
        >
          <Bell size={19} className="text-ink/70" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral-400 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </div>

      {/* Search entry point */}
      <Link
        href="/customer/search"
        className="flex h-12 items-center gap-2.5 rounded-xl border border-line bg-white px-4 text-ink/50"
      >
        <SearchIcon size={18} />
        What service do you need?
      </Link>

      {/* Categories */}
      <section>
        <h2 className="mb-3 font-display text-base font-semibold text-ink">Categories</h2>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {categories.map((c) => {
            const Icon = categoryIcon(c.iconName);
            return (
              <Link
                key={c.id}
                href={`/customer/search?category=${c.slug}`}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-white px-2 py-3 text-center hover:bg-brand-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Icon size={18} />
                </span>
                <span className="text-[11px] font-medium leading-tight text-ink/70">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recommended artisans */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-ink">Recommended for you</h2>
          <Link href="/customer/search" className="text-sm font-medium text-brand-600">
            See all
          </Link>
        </div>
        {recommended.length > 0 ? (
          <div className="space-y-3">
            {recommended.map((a) => (
              <ArtisanCard key={a.id} artisan={a} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No artisans yet"
            body="Once service providers join and list their services, they'll be recommended here."
          />
        )}
      </section>
    </div>
  );
}
