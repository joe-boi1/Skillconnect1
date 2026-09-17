"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function TopBar({ fullName, roleLabel }: { fullName: string; roleLabel: string }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
      <div>
        <p className="text-sm font-medium text-ink">{fullName}</p>
        <p className="text-xs text-ink/50">{roleLabel}</p>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink/60 hover:bg-paper"
      >
        <LogOut size={16} />
        Log out
      </button>
    </header>
  );
}
