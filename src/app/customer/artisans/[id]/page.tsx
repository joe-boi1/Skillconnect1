import { notFound } from "next/navigation";
import { Star, MapPin, Briefcase, BadgeCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getArtisanProfile } from "@/lib/artisans";
import { db } from "@/lib/db";
import { formatNaira, timeAgo } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SaveButton, BookingForm } from "@/components/artisan/ArtisanProfileActions";

export default async function ArtisanProfilePage({ params }: { params: { id: string } }) {
  const [user, artisan] = await Promise.all([getCurrentUser(), getArtisanProfile(params.id)]);
  if (!artisan) notFound();

  let initiallySaved = false;
  if (user?.customerProfile) {
    const saved = await db.savedArtisan.findUnique({
      where: { customerId_artisanId: { customerId: user.customerProfile.id, artisanId: artisan.id } },
    });
    initiallySaved = !!saved;
  }

  const name = artisan.businessName || artisan.user.fullName;
  const location = [artisan.city, artisan.state].filter(Boolean).join(", ");
  const verificationTone =
    artisan.verificationStatus === "APPROVED" ? "brand" : artisan.verificationStatus === "PENDING" ? "amber" : "neutral";

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-xl font-semibold text-brand-700">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <h1 className="truncate font-display text-lg font-semibold text-ink">{name}</h1>
                {artisan.verificationStatus === "APPROVED" && (
                  <BadgeCheck size={17} className="shrink-0 text-brand-500" aria-label="Verified" />
                )}
              </div>
              {user?.role === "CUSTOMER" && <SaveButton artisanId={artisan.id} initiallySaved={initiallySaved} />}
            </div>
            <div className="mt-1.5">
              <Badge tone={verificationTone}>{artisan.verificationStatus.toLowerCase()}</Badge>
            </div>
            {artisan.profession && <p className="mt-1.5 text-sm font-medium text-brand-600">{artisan.profession}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/60">
              {artisan.totalReviews > 0 ? (
                <span className="flex items-center gap-1 text-amber-600">
                  <Star size={14} fill="currentColor" strokeWidth={0} />
                  {artisan.averageRating.toFixed(1)} ({artisan.totalReviews} reviews)
                </span>
              ) : (
                <span>No reviews yet</span>
              )}
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {location}
                </span>
              )}
              {artisan.yearsExperience != null && (
                <span className="flex items-center gap-1">
                  <Briefcase size={14} /> {artisan.yearsExperience} years experience
                </span>
              )}
            </div>
          </div>
        </div>
        {artisan.bio && <p className="mt-4 text-sm leading-relaxed text-ink/70">{artisan.bio}</p>}
        {artisan.serviceArea && (
          <p className="mt-3 text-xs text-ink/50">
            <span className="font-medium text-ink/60">Service area:</span> {artisan.serviceArea}
          </p>
        )}
      </Card>

      <section>
        <h2 className="mb-3 font-display text-base font-semibold text-ink">Services</h2>
        <div className="space-y-2">
          {artisan.services.map((s) => (
            <Card key={s.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink">{s.title}</p>
                <p className="text-xs text-ink/50">{s.category.name}</p>
              </div>
              <p className="text-sm font-semibold text-ink">
                {s.priceMin ? formatNaira(s.priceMin) : "Quote"}
                {s.priceMax && s.priceMax !== s.priceMin ? `–${formatNaira(s.priceMax)}` : ""}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {artisan.portfolioItems.length > 0 && (
        <section>
          <h2 className="mb-3 font-display text-base font-semibold text-ink">Portfolio</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {artisan.portfolioItems.map((p) => (
              <div key={p.id} className="overflow-hidden rounded-xl border border-line bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imageUrl} alt={p.title} className="aspect-square w-full object-cover" />
                <div className="p-2.5">
                  <p className="truncate text-xs font-medium text-ink">{p.title}</p>
                  {p.projectDate && (
                    <p className="text-[11px] text-ink/40">
                      {new Date(p.projectDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 font-display text-base font-semibold text-ink">Reviews</h2>
        {artisan.reviews.length > 0 ? (
          <div className="space-y-2">
            {artisan.reviews.map((r) => (
              <Card key={r.id}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink">{r.author.fullName}</p>
                  <span className="flex items-center gap-1 text-xs text-amber-600">
                    <Star size={12} fill="currentColor" strokeWidth={0} /> {r.rating}
                  </span>
                </div>
                {r.comment && <p className="mt-1 text-sm text-ink/70">{r.comment}</p>}
                <p className="mt-1 text-xs text-ink/40">{timeAgo(r.createdAt)}</p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/50">No reviews yet.</p>
        )}
      </section>

      {user?.role === "CUSTOMER" && (
        <BookingForm artisanName={name} services={artisan.services} />
      )}
    </div>
  );
}
