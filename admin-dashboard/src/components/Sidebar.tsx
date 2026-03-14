import { Link, useLocation } from "react-router-dom";

const navItems = [
  { key: "dashboard", to: "/", label: "Dashboard", icon: "dashboard" },
  { key: "horoscopes", to: "/horoscopes", label: "Horoscopes", icon: "nights_stay" },
  { key: "generate", to: "/generate", label: "Generate", icon: "auto_fix_high" },
  { key: "users", to: "/users", label: "Users", icon: "group" },
  { key: "settings", to: "/settings", label: "Settings", icon: "settings", separated: true },
];

export const Sidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  let activeKey = "dashboard";
  if (pathname.startsWith("/horoscopes")) activeKey = "horoscopes";
  else if (pathname.startsWith("/generate")) activeKey = "generate";
  else if (pathname.startsWith("/users")) activeKey = "users";
  else if (pathname.startsWith("/settings")) activeKey = "settings";

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-purple-900/30 bg-[#0d0618]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7f13ec] text-white">
          <span className="material-symbols-outlined text-xl">auto_awesome</span>
        </div>
        <div>
          <h1 className="text-base font-bold leading-none text-white">
            AstraDaily
          </h1>
          <p className="mt-1 text-xs text-purple-400/70">Admin Portal</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-2 flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const active = item.key === activeKey;

          return (
            <div key={item.key}>
              {item.separated && (
                <div className="mb-2 mt-4 border-t border-purple-900/30" />
              )}
              <Link
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
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
        })}
      </nav>

      {/* Footer */}
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
      </div>
    </aside>
  );
};
