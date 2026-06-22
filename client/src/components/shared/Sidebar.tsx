import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  FileText,
  CheckCircle,
  Bell,
  Settings,
  Wallet // Added for the footer section
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Approvals", path: "/approvals", icon: CheckCircle },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-[#00355f] shadow-sm flex flex-col py-6 z-50">
      
      {/* Logo / Title */}
      <div className="px-4 mb-8">
        <h1 className="text-[16px] font-bold text-white tracking-tight">Asset Ledger</h1>
        <p className="text-[10px] text-white/60 font-bold tracking-widest uppercase mt-1">IT Finance Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 border-l-4 transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0f4c81] text-[#8ebdf9] border-[#8ebdf9]"
                    : "border-transparent text-white/70 hover:bg-[#07497d] hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span className="text-[14px]">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Admin Portal */}
      <div className="px-4 mt-auto pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#0f4c81] flex items-center justify-center text-[#8ebdf9]">
            <Wallet size={16} />
          </div>
          <div>
            <p className="text-white font-bold text-[13px]">Admin Portal</p>
            <p className="text-white/50 text-[10px]">v2.4.0-PRO</p>
          </div>
        </div>
      </div>

    </aside>
  );
}