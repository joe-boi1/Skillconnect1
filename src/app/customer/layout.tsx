import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { BottomNav } from "@/components/nav/BottomNav";
import { SideNav } from "@/components/nav/SideNav";
import { TopBar } from "@/components/nav/TopBar";
import { Home, Search, CalendarCheck, MessageCircle, User } from "lucide-react";

const NAV = [
  { href: "/customer/home", label: "Home", icon: Home },
  { href: "/customer/search", label: "Search", icon: Search },
  { href: "/customer/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/customer/messages", label: "Messages", icon: MessageCircle },
  { href: "/customer/account", label: "Account", icon: User },
];

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  // Belt-and-suspenders: middleware already enforces this, but a layout
  // guard keeps the area safe even if middleware config ever drifts.
  if (!user || user.role !== "CUSTOMER") redirect("/login");

  return (
    <div className="flex min-h-screen">
      <SideNav items={NAV} brand="SkillConnect" />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar fullName={user.fullName} roleLabel="Customer" />
        <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 sm:pb-10">{children}</main>
        <BottomNav items={NAV} />
      </div>
    </div>
  );
}
