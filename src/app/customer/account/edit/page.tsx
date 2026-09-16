import { getCurrentUser } from "@/lib/session";
import { PageHeader } from "@/components/ui/PageHeader";
import { EditProfileForm } from "@/components/account/EditProfileForm";

export default async function EditProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div>
      <PageHeader title="Edit Profile" />
      <EditProfileForm
        fullName={user.fullName}
        email={user.email}
        phone={user.phone}
        city={user.customerProfile?.city ?? null}
        state={user.customerProfile?.state ?? null}
        address={user.customerProfile?.address ?? null}
      />
    </div>
  );
}
