import { getCurrentUser } from "@/lib/session";
import { PageHeader } from "@/components/ui/PageHeader";
import { EditArtisanProfileForm } from "@/components/artisan/EditArtisanProfileForm";

export default async function EditArtisanProfilePage() {
  const user = await getCurrentUser();
  if (!user?.artisanProfile) return null;

  return (
    <div>
      <PageHeader title="Edit Profile" />
      <EditArtisanProfileForm
        fullName={user.fullName}
        phone={user.phone}
        avatarUrl={user.artisanProfile.avatarUrl}
        businessName={user.artisanProfile.businessName}
        profession={user.artisanProfile.profession}
        bio={user.artisanProfile.bio}
        yearsExperience={user.artisanProfile.yearsExperience}
        city={user.artisanProfile.city}
        state={user.artisanProfile.state}
        serviceArea={user.artisanProfile.serviceArea}
      />
    </div>
  );
}
