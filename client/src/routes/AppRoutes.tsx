import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../modules/auth/LoginPage";

// Employee
import EmployeeRequestPage from "../modules/Employee/Employeerequestpage";

// Admin
import DashboardPage    from "../modules/Admin/DashboardPage";
import TransactionsPage from "../modules/Admin/TransactionsPage";
import ApprovalsPage    from "../modules/Admin/ApprovalsPage";
import ReportsPage      from "../modules/Admin/ReportsPage";
import NotificationsPage from "../modules/Admin/NotificationsPage";
import UserManagement   from "../modules/Admin/UserPage";
import SettingsPage     from "../modules/Admin/SettingsPage"; 
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ─────────────────────────────────────────────────── */}
        <Route path="/" element={<LoginPage />} />

        {/* ── Protected (inside sidebar + topbar layout) ──────────────── */}
        <Route element={<MainLayout />}>

          {/* Default redirect from /dashboard root
          <Route index element={<Navigate to="/dashboard" replace />} /> */}

          {/* Employee */}
          <Route path="/request"       element={<EmployeeRequestPage />} />

          {/* Admin */}
          <Route path="/dashboard"     element={<DashboardPage />} />
          <Route path="/transactions"  element={<TransactionsPage />} />
          <Route path="/approvals"     element={<ApprovalsPage />} />
          <Route path="/reports"       element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/users"         element={<UserManagement />} />
          <Route path="/settings"      element={<SettingsPage />} />

          {/* Catch-all inside layout → redirect to dashboard */}
          {/* <Route path="*" element={<Navigate to="/dashboard" replace />} /> */}
        </Route>

        {/* Catch-all outside layout → back to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}