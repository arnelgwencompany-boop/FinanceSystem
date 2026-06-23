import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../modules/auth/LoginPage";
import DashboardPage from "../modules/dashboard/DashboardPage";
import TransactionsPage from "../modules/transactions/TransactionsPage";
import RequestPage from "../modules/requests/RequestPage";
import ApprovalsPage from "../modules/approvals/ApprovalsPage";
import ReportsPage from "../modules/reports/ReportsPage";
import NotificationsPage from "../modules/notifications/NotificationsPage";
import SettingsPage from "../modules/settings/SettingsPgae";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginPage />} />

        {/* Main System */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/request" element={<RequestPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}