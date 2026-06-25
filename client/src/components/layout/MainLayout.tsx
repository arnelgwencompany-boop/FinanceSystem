import { Outlet } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
// import Header from "../shared/Header";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* <Header /> */}
        <main className="p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}