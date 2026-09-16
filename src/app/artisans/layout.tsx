import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { BottomNav } from "@/components/nav/BottomNav";
import { SideNav } from "@/components/nav/SideNav";
import { TopBar } from "@/components/nav/TopBar";
import { LayoutDashboard, Briefcase, MessageCircle, Wallet, User } from "lucide-react";

const NAV = [
  { href: "/artisan/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/artisan/jobs", label: "Jobs", icon: Briefcase },
  { href: "/artisan/messages", label: "Messages", icon: MessageCircle },
  { href: "/artisan/earnings", label: "Earnings", icon: Wallet },
  { href: "/artisan/account", label: "Account", icon: User },
];

export default async function ArtisanLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ARTISAN") redirect("/login");

  return (
    <div className="flex min-h-screen">
      <SideNav items={NAV} brand="SkillConnect" />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar fullName={user.fullName} roleLabel="Service provider" />
        <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 sm:pb-10">{children}</main>
        <BottomNav items={NAV} />
      </div>
    </div>
  );
}
