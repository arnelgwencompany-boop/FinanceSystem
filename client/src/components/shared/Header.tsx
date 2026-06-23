import { Search, HelpCircle, Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-240px)] h-16 bg-[#ffffff] border-b border-[#c2c7d1] flex justify-between items-center px-8 z-40">
      
      {/* Left - Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#727780]" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="h-9 w-64 pl-10 pr-4 bg-[#ffffff] border border-[#c2c7d1] rounded-lg text-[13px] focus:ring-1 focus:ring-[#00355f] focus:border-[#00355f] outline-none transition-all"
          />
        </div>
      </div>

      {/* Right - Actions & User Profile */}
      <div className="flex items-center gap-6">
        
        {/* Help & Notifications */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-[#505f76] hover:text-[#00355f] transition-all duration-200">
            <HelpCircle size={20} />
          </button>
          <div className="relative">
            <button className="p-2 text-[#505f76] hover:text-[#00355f] transition-all duration-200 relative">
              <Bell size={20} />
              {/* Notification Dot */}
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-[#c2c7d1] mx-2"></div>

        {/* User Profile */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-[#e0e3e5] p-1 rounded-lg transition-colors">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-bold text-[#00355f]">Arnel Gwen</p>
            <p className="text-[10px] text-[#505f76] font-bold uppercase tracking-wider">Administrator</p>
          </div>
          
          {/* User Icon Badge */}
          <div className="w-10 h-10 rounded-full border border-[#c2c7d1] bg-[#f2f4f6] flex items-center justify-center text-[#505f76]">
            <User size={20} />
          </div>
        </div>

      </div>
    </header>
  );
}