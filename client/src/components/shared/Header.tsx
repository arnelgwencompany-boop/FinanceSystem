import { Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-white">
      
      {/* Left - Page Title */}
      <h1 className="text-lg font-semibold">
        IT Petty Cash System
      </h1>

      {/* Right - Actions */}
      <div className="flex items-center gap-4">
        
        {/* Notifications */}
        <button className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
            3
          </span>
        </button>

        {/* User */}
        <div className="flex items-center gap-2 cursor-pointer">
          <User className="w-5 h-5" />
          <span className="text-sm">Admin</span>
        </div>

      </div>
    </header>
  );
}