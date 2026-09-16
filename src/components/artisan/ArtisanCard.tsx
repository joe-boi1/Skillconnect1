import Link from "next/link";
import { Star, MapPin, BadgeCheck, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatNaira } from "@/lib/format";
import { startingPrice, professionLabel, type ArtisanCardData } from "@/lib/artisans";

// A single, reusable card used on Home (recommended), Search (results) and
// Saved Artisans — every field here is read straight off the query result,
// nothing is hand-typed placeholder text.
export function ArtisanCard({ artisan }: { artisan: ArtisanCardData }) {
  const name = artisan.businessName || artisan.user.fullName;
  const profession = professionLabel(artisan.profession, artisan.services, "Service provider");
  const price = startingPrice(artisan.services);
  const location = [artisan.city, artisan.state].filter(Boolean).join(", ");

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-lg font-semibold text-brand-700">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-display text-[15px] font-semibold text-ink">{name}</p>
            {artisan.verificationStatus === "APPROVED" && (
              <BadgeCheck size={16} className="shrink-0 text-brand-500" aria-label="Verified" />
            )}
          </div>
          <p className="truncate text-sm text-ink/60">{profession}</p>
          <div className="mt-1 flex items-center gap-3 text-xs text-ink/50">
            {artisan.totalReviews > 0 ? (
              <span className="flex items-center gap-1 text-amber-600">
                <Star size={13} fill="currentColor" strokeWidth={0} />
                {artisan.averageRating.toFixed(1)}
                <span className="text-ink/40">({artisan.totalReviews})</span>
              </span>
            ) : (
              <span>New</span>
            )}
            {location && (
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {location}
              </span>
            )}
            {artisan.yearsExperience != null && (
              <span className="flex items-center gap-1">
                <Briefcase size={13} /> {artisan.yearsExperience}y exp
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-line pt-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-ink/40">Starting at</p>
          <p className="text-sm font-semibold text-ink">
            {price != null ? formatNaira(price) : "Contact for quote"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/customer/artisans/${artisan.id}`} className="flex-1 sm:flex-none">
            <Button variant="secondary" size="md" className="w-full">View Profile</Button>
          </Link>
          <Link href={`/customer/artisans/${artisan.id}#book`} className="flex-1 sm:flex-none">
            <Button size="md" className="w-full">Book Now</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
