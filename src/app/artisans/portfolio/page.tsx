import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { PortfolioUploadForm } from "@/components/portfolio/PortfolioUploadForm";
import { PortfolioDeleteButton } from "@/components/portfolio/PortfolioDeleteButton";

export default async function PortfolioPage() {
  const user = await getCurrentUser();
  if (!user?.artisanProfile) return null;

  const items = await db.portfolioItem.findMany({
    where: { artisanId: user.artisanProfile.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <PageHeader title="Portfolio" subtitle="Shown publicly on your profile" />
      <PortfolioUploadForm />

      {items.length === 0 ? (
        <EmptyState title="No work uploaded yet" body="Add photos of past jobs to build customer trust." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="relative overflow-hidden rounded-xl border border-line bg-white">
              <PortfolioDeleteButton itemId={item.id} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.title} className="aspect-square w-full object-cover" />
              <div className="p-2.5">
                <p className="truncate text-xs font-medium text-ink">{item.title}</p>
                {item.projectDate && (
                  <p className="text-[11px] text-ink/40">
                    {new Date(item.projectDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
