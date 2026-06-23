import React, { useState } from "react";
import { CheckCircle, AlertTriangle, Info, CheckCheck, Filter } from "lucide-react";

type Notification = {
  id: number;
  type: "Success" | "Warning" | "Info";
  title: string;
  message: string;
  date: string;
  read: boolean;
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: "Success", title: "Transaction Approved", message: "Bulk purchase order #PO-2024-881 approved.", date: "10:24 AM", read: false },
    { id: 2, type: "Warning", title: "Budget Limit Alert", message: "Q3 IT budget reached 85%.", date: "09:15 AM", read: false },
    { id: 3, type: "Info", title: "System Maintenance", message: "Scheduled upgrade complete.", date: "08:00 AM", read: true },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Helper to render the correct icon
  const getIcon = (type: string) => {
    switch (type) {
      case "Success": return <CheckCircle className="text-green-700" size={20} />;
      case "Warning": return <AlertTriangle className="text-amber-700" size={20} />;
      default: return <Info className="text-blue-700" size={20} />;
    }
  };

  return (
    <main className="pl-[240px] pt-0 h-[calc(100vh-56px)] overflow-y-auto bg-[#f7f9fb]">
      <div className="px-8 py-8 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#00355f] mb-1">Notifications</h1>
            <p className="text-gray-600">Stay updated on system activities and workflow tasks.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={markAllAsRead} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-white">
              <CheckCheck size={18} /> Mark all read
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#00355f] text-white rounded-lg text-sm font-semibold">
              <Filter size={18} /> Preferences
            </button>
          </div>
        </div>

        {/* Notifications Feed */}
        <div className="space-y-3">
          {notifications.map((n) => (
            <div 
              key={n.id}
              className={`relative bg-white border rounded-lg p-4 flex gap-4 transition-all hover:shadow-sm ${
                !n.read ? "border-l-4 border-l-[#00355f] border-r-gray-200 border-t-gray-200 border-b-gray-200" : "border-gray-200 opacity-90"
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                n.type === "Success" ? "bg-green-50" : n.type === "Warning" ? "bg-amber-50" : "bg-blue-50"
              }`}>
                {getIcon(n.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{n.title}</h3>
                  <span className="text-xs text-gray-500 font-mono">{n.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{n.message}</p>
                <button className="text-xs font-bold uppercase text-[#00355f] hover:underline">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Notifications;