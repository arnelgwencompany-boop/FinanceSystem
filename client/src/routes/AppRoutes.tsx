import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../modules/auth/LoginPage";

// Employee
import EmployeeRequestPage from "../modules/Employee/Employeerequestpage";

// Supervisor
import SupervisorApprovalsPage from "../modules/Supervisor/Supervisorapprovalspage";

// Director
import DirectorApprovalsPage from "../modules/Director/Directorapprovalspage";

// Finance
import FinanceDashboard from "../modules/Finance/Financepage"

// Admin
import DashboardPage     from "../modules/Admin/DashboardPage";
import TransactionsPage  from "../modules/Admin/TransactionsPage";
import ApprovalsPage     from "../modules/Admin/ApprovalsPage";
import ReportsPage       from "../modules/Admin/ReportsPage";
import NotificationsPage from "../modules/Admin/NotificationsPage";
import UserManagement    from "../modules/Admin/UserPage";
import SettingsPage      from "../modules/Admin/SettingsPage";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "admin" | "supervisor" | "director" | "finance" | "employee";

// ─── Read current user from localStorage ─────────────────────────────────────
function getCurrentUser(): { name: string; role: Role; initials: string } | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ─── Redirect to the correct home page based on role ─────────────────────────
function RoleHome() {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/" replace />;

  const roleHome: Record<Role, string> = {
    admin:      "/dashboard",
    supervisor: "/supervisor-approval",
    director:   "/director-approval",
    finance:    "/finance-page  ",
    employee:   "/request",
  };

  return <Navigate to={roleHome[user.role]} replace />;
}

// ─── Protected Route — only allows listed roles ───────────────────────────────
function ProtectedRoute({
  element,
  allowed,
}: {
  element: React.ReactElement;
  allowed: Role[];
}) {
  const user = getCurrentUser();

  // Not logged in → back to login
  if (!user || !localStorage.getItem("token")) {
    return <Navigate to="/" replace />;
  }

  // Wrong role → redirect to their own home
  if (!allowed.includes(user.role)) {
    return <RoleHome />;
  }

  return element;
}

// ─── Routes ──────────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ───────────────────────────────────────────────────── */}
        <Route path="/" element={<LoginPage />} />

        {/* ── Protected layout ─────────────────────────────────────────── */}
        <Route element={<MainLayout />}>

          {/* Role-based home redirect */}
          <Route path="/home" element={<RoleHome />} />

          {/* ── Employee ─────────────────────────────────────────────── */}
          <Route
            path="/request"
            element={
              <ProtectedRoute
                element={<EmployeeRequestPage />}
                allowed={["employee"]}
              />
            }
          />

          {/* ── Supervisor ───────────────────────────────────────────── */}
          <Route
            path="/supervisor-approval"
            element={
              <ProtectedRoute
                element={<SupervisorApprovalsPage />}
                allowed={["supervisor"]}
              />
            }
          />

          {/* ── Director ─────────────────────────────────────────────── */}
          <Route
            path="/director-approval"
            element={
              <ProtectedRoute
                element={<DirectorApprovalsPage />}
                allowed={["director"]}
              />
            }
          />

           {/* ── Finance ─────────────────────────────────────────────── */}
           <Route 
              path="/finance-page"
               element={
                <ProtectedRoute
                  element={<FinanceDashboard />}
                  allowed={["finance"]}
                />
            }
            />
          {/* ── Admin & Finance shared routes ─────────────────────────── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                element={<DashboardPage />}
                allowed={["admin", "finance", "supervisor", "director"]}
              />
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute
                element={<TransactionsPage />}
                allowed={["admin", "finance", "supervisor"]}
              />
            }
          />
          <Route
            path="/approvals"
            element={
              <ProtectedRoute
                element={<ApprovalsPage />}
                allowed={["admin"]}
              />
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute
                element={<ReportsPage />}
                allowed={["admin", "finance", "supervisor", "director"]}
              />
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute
                element={<NotificationsPage />}
                allowed={["admin", "finance", "supervisor", "director", "employee"]}
              />
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute
                element={<UserManagement />}
                allowed={["admin"]}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute
                element={<SettingsPage />}
                allowed={["admin", "finance", "supervisor", "director", "employee"]}
              />
            }
          />

          {/* Catch-all inside layout → role home */}
          <Route path="*" element={<RoleHome />} />
        </Route>

        {/* Catch-all outside layout → login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}