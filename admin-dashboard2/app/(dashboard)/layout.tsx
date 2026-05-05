"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

type NavItem =
  | { type: "item"; key: string; href: string; label: string; icon: string; separated?: boolean }
  | { type: "section"; key: string; label: string; icon: string; children: Array<{ key: string; href: string; label: string; icon: string }> };

const navItems: NavItem[] = [
  {
    type: "section",
    key: "mobile",
    label: "MOBILE",
    icon: "smartphone",
    children: [
      { key: "dashboard-mobile", href: "/dashboard/mobile", label: "Dashboard", icon: "dashboard" },
      { key: "users-all", href: "/users", label: "All users", icon: "person" },
      { key: "users-daily-active", href: "/users/daily-active", label: "DAU", icon: "monitoring" },
      { key: "dashboard-mobile-charts", href: "/dashboard/mobile/charts", label: "Charts", icon: "show_chart" },
    ],
  },
  {
    type: "section",
    key: "portfolio",
    label: "PORTFOLIO",
    icon: "public",
    children: [
      { key: "dashboard-portfolio", href: "/dashboard/portfolio", label: "Dashboard", icon: "dashboard" },
      { key: "dashboard-portfolio-visitors", href: "/dashboard/portfolio", label: "Visitors", icon: "groups" },
      { key: "dashboard-portfolio-charts", href: "/dashboard/portfolio#charts", label: "Charts", icon: "show_chart" },
    ],
  },
  {
    type: "section",
    key: "horoscopes",
    label: "HOROSCOPES",
    icon: "nights_stay",
    children: [
      { key: "horoscopes-daily", href: "/horoscopes/daily", label: "Daily", icon: "wb_sunny" },
      { key: "horoscopes-weekly", href: "/horoscopes/weekly", label: "Weekly", icon: "date_range" },
    ],
  },
  {
    type: "section",
    key: "push-notifications",
    label: "PUSH NOTIFICATIONS",
    icon: "notifications",
    children: [
      {
        key: "notifications-pillar",
        href: "/notifications/pillar",
        label: "Pillar notifications",
        icon: "flare",
      },
      {
        key: "notifications-motivational",
        href: "/notifications/motivational",
        label: "Motivational notifications",
        icon: "format_quote",
      },
    ],
  },
  { type: "item", key: "settings", href: "/settings", label: "Settings", icon: "settings", separated: true },
] as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!token) {
      router.replace("/login");
    }
  }, [hasHydrated, token, router]);

  if (!hasHydrated) {
    return null;
  }

  if (!token) {
    return null;
  }

  let activeKey = "dashboard-mobile";
  if (pathname?.startsWith("/horoscopes/daily")) activeKey = "horoscopes-daily";
  else if (pathname?.startsWith("/horoscopes/weekly")) activeKey = "horoscopes-weekly";
  else if (pathname?.match(/^\/horoscopes\/[0-9a-f-]{36}$/i)) activeKey = "horoscopes-daily";
  else if (pathname === "/horoscopes") activeKey = "horoscopes-daily";
  else if (pathname?.startsWith("/dashboard/portfolio")) activeKey = "dashboard-portfolio";
  else if (pathname?.startsWith("/dashboard/mobile/charts")) activeKey = "dashboard-mobile-charts";
  else if (pathname?.startsWith("/dashboard/mobile")) activeKey = "dashboard-mobile";
  else if (pathname === "/") activeKey = "dashboard-mobile";
  else if (pathname?.startsWith("/users/daily-active")) activeKey = "users-daily-active";
  else if (pathname?.startsWith("/users")) activeKey = "users-all";
  else if (pathname?.startsWith("/notifications/pillar")) activeKey = "notifications-pillar";
  else if (pathname?.startsWith("/notifications/motivational")) activeKey = "notifications-motivational";
  else if (pathname?.startsWith("/notifications")) activeKey = "notifications-pillar";
  else if (pathname?.startsWith("/settings")) activeKey = "settings";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#050316] via-[#05021A] to-[#0B061F] text-foreground">
      <aside className="flex h-screen w-64 flex-col border-r border-purple-900/30 bg-[#0d0618]">
        <Link href="/" className="flex items-center gap-3 px-6 py-6 hover:opacity-95">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7f13ec] text-white">
            <span className="material-symbols-outlined text-xl">auto_awesome</span>
          </div>
          <div>
            <h1 className="text-base font-bold leading-none text-white">
              AstraDaily
            </h1>
            <p className="mt-1 text-xs text-purple-400/70">Admin Portal</p>
          </div>
        </Link>
        <nav className="mt-2 flex-1 space-y-1 px-4">
          {navItems.map((item) => {
            if (item.type === "item") {
              return (
                <div key={item.key}>
                  {item.separated && (
                    <div className="mb-2 mt-4 border-t border-purple-900/30" />
                  )}
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${activeKey === item.key
                        ? "border border-[#7f13ec]/30 bg-[#7f13ec]/15 text-[#7f13ec]"
                        : "border border-transparent text-slate-400 hover:bg-purple-900/25 hover:text-purple-200"
                      }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </div>
              );
            }

            return (
              <div key={item.key} className="pt-3">
                <div className="px-3 pb-2 text-xs font-semibold tracking-widest text-slate-500">
                  {item.label}
                </div>
                <div className="space-y-1">
                  {item.children.map((c) => (
                    <Link
                      key={c.key}
                      href={c.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${activeKey === c.key
                          ? "border border-[#7f13ec]/30 bg-[#7f13ec]/15 text-[#7f13ec]"
                          : "border border-transparent text-slate-400 hover:bg-purple-900/25 hover:text-purple-200"
                        }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {c.icon}
                      </span>
                      <span className="font-medium">{c.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
        <div className="border-t border-purple-900/30 px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl bg-purple-900/20 p-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7f13ec]/30 text-xs font-bold text-purple-200">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-200">Admin</p>
              <p className="text-[10px] text-slate-500">Portal</p>
            </div>
          </div>
          {token && (
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-sm font-medium text-purple-200 transition-colors hover:bg-purple-500/20"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Logout</span>
            </button>
          )}
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto px-8 py-6 space-y-6">{children}</main>
    </div>
  );
}
