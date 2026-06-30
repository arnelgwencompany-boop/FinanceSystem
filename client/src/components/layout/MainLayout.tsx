import { Outlet } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import Header from "../shared/Header";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <Sidebar />
      <Header />

      {/* Offset for fixed sidebar (270px) and fixed header (64px) */}
      <main className="ml-[270px] pt-16">
        <Outlet />
      </main>
    </div>
  );
}