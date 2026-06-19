import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../modules/auth/LoginPage";
// import DashboardPage from "../modules/dashboard/DashboardPage";
// import TransactionsPage from "../modules/transactions/TransactionsPage";
// import ApprovalsPage from "../modules/approvals/ApprovalsPage";
// import UploadPage from "../modules/bulk-upload/UploadPage";
// import ReportsPage from "../modules/reports/ReportsPage";
// import NotificationsPage from "../modules/notifications/NotificationsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginPage />} />

        {/* Main System */}
        <Route element={<MainLayout />}>
          {/* <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
          <Route path="/bulk-upload" element={<UploadPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}