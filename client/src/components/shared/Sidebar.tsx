import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  FileText,
  CheckCircle,
  Bell,
  Settings,
  FilePlus,
  Users,
  ChevronRight,
} from "lucide-react";
import logo from "../../../public/logo.png";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  // { name: "Request Management", path: "/request", icon: FilePlus },
  { name: "Approvals", path: "/approvals", icon: CheckCircle },
  { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "User Management", path: "/users", icon: Users },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 h-full w-[260px] flex flex-col z-50"
      style={{
        backgroundColor: "#0a1f3c",
        boxShadow: "4px 0 32px rgba(0,0,0,0.3)",
      }}
    >
      {/* Logo + Brand */}
      <div className="px-5 py-6 flex items-center gap-4 flex-shrink-0">
        {/* White background bubble so logo is always visible */}
        <div
          className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          }}
        >
          <img
            src={logo}
            alt="Company logo"
            className="w-9 h-9 object-contain"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              t.style.display = "none";
              const p = t.parentElement;
              if (p)
                p.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a1f3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
            }}
          />
        </div>

        {/* Brand text — full white for visibility */}
        <div>
          <h1
            className="text-[15px] font-extrabold leading-tight tracking-tight"
            style={{ color: "#ffffff" }}
          >
            Petty Cash System
          </h1>
          <p
            className="text-[10px] font-semibold tracking-[0.18em] uppercase mt-1"
            style={{ color: "#60a5fa" }}
          >
            IT Finance Management
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        className="mx-5 mb-5 flex-shrink-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.1)" }}
      />

      {/* Section label */}
      <p
        className="px-5 mb-2 text-[10px] font-bold tracking-[0.2em] uppercase flex-shrink-0"
        style={{ color: "rgba(148,163,184,0.7)" }}
      >
        Main Menu
      </p>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 px-3 py-[10px] rounded-xl transition-all duration-200 cursor-pointer"
              style={({ isActive }) =>
                isActive
                  ? {
                      backgroundColor: "#ffffff",
                      boxShadow: "0 2px 16px rgba(37,99,235,0.18)",
                    }
                  : { backgroundColor: "transparent" }
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon box */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                    style={{
                      backgroundColor: isActive
                        ? "#0a1f3c"
                        : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <Icon
                      size={16}
                      color={isActive ? "#60a5fa" : "rgba(255,255,255,0.75)"}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className="flex-1 text-[13.5px] font-semibold"
                    style={{
                      color: isActive ? "#0a1f3c" : "rgba(255,255,255,0.8)",
                    }}
                  >
                    {item.name}
                  </span>

                  {/* Active chevron */}
                  {isActive && (
                    <ChevronRight size={15} color="#2563eb" strokeWidth={2.5} />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}