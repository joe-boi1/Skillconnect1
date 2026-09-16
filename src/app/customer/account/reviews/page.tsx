import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card } from "@/components/ui/Card";
import { Star } from "lucide-react";
import { timeAgo } from "@/lib/format";

export default async function CustomerReviewsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const reviews = await db.review.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    include: { artisanProfile: { include: { user: { select: { fullName: true } } } } },
  });

  return (
    <div>
      <PageHeader title="Reviews" subtitle="Reviews you've left for artisans" />
      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          body="After a booking is completed, you can leave a review for the artisan."
        />
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => {
            const name = r.artisanProfile.businessName || r.artisanProfile.user.fullName;
            return (
              <Card key={r.id}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink">{name}</p>
                  <span className="flex items-center gap-1 text-xs text-amber-600">
                    <Star size={12} fill="currentColor" strokeWidth={0} /> {r.rating}
                  </span>
                </div>
                {r.comment && <p className="mt-1 text-sm text-ink/70">{r.comment}</p>}
                <p className="mt-1.5 text-xs text-ink/40">{timeAgo(r.createdAt)}</p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
