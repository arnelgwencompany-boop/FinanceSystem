import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Upload,
  FileText,
  CheckCircle,
  Bell,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", path: "/transactions", icon: ArrowLeftRight },
  { name: "Bulk Upload", path: "/bulk-upload", icon: Upload },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Approvals", path: "/approvals", icon: CheckCircle },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      
      {/* Logo / Title */}
      <div className="p-4 text-lg font-bold border-b border-gray-700">
        Finance System
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  isActive
                    ? "bg-gray-700"
                    : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
}