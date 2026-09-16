import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ArtisanCard } from "@/components/artisan/ArtisanCard";

export default async function SavedArtisansPage() {
  const user = await getCurrentUser();
  if (!user?.customerProfile) return null;

  const saved = await db.savedArtisan.findMany({
    where: { customerId: user.customerProfile.id },
    orderBy: { createdAt: "desc" },
    include: {
      artisan: {
        select: {
          id: true,
          businessName: true,
          profession: true,
          city: true,
          state: true,
          yearsExperience: true,
          avatarUrl: true,
          verificationStatus: true,
          averageRating: true,
          totalReviews: true,
          isAvailable: true,
          availabilityStatus: true,
          user: { select: { fullName: true } },
          services: {
            where: { isActive: true },
            select: { title: true, priceMin: true, category: { select: { name: true } } },
          },
        },
      },
    },
  });

  return (
    <div>
      <PageHeader title="Saved Artisans" subtitle="Artisans you've bookmarked for later" />
      {saved.length === 0 ? (
        <EmptyState
          title="No saved artisans"
          body="Tap the heart icon on an artisan's profile to save them here."
          action={
            <Link href="/customer/search">
              <Button>Browse artisans</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {saved.map((s) => (
            <ArtisanCard key={s.id} artisan={s.artisan} />
          ))}
        </div>
      )}
    </div>
  );
}
