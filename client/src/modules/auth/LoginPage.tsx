import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Lock, ArrowRight, CheckCircle2,
  Eye, EyeOff, ShieldCheck, X, AlertTriangle, Loader2,
} from "lucide-react";
import logo from "../../../public/logo.png";
import { loginUser } from "../../apis/login";
import { getProfile } from "../../apis/getProfile";

// ─── Role → landing page map (mirrors AppRoutes RoleHome) ─────────────────────
type Role = "employee" | "supervisor" | "director" | "finance" | "admin";

const ROLE_HOME: Record<Role, string> = {
  admin:      "/dashboard",
  supervisor: "/supervisor-approval",
  director:   "/director-approval",
  finance:    "/finance",
  employee:   "/request",
};

// ─── Toast ────────────────────────────────────────────────────────────────────
interface Toast { id: number; type: "success" | "error"; message: string; }

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[100] space-y-2 min-w-[320px] max-w-[400px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-lg border text-[14px] font-semibold animate-[slideIn_0.25s_ease-out] ${
            t.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {t.type === "success"
            ? <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
            : <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />}
          <span className="flex-1 leading-snug">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="opacity-50 hover:opacity-100 flex-shrink-0">
            <X size={15} />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
  };
  const dismiss = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));
  return { toasts, add, dismiss };
}

// ─── Loading overlay ──────────────────────────────────────────────────────────
function LoadingOverlay({ stage }: { stage: "authenticating" | "profile" | "redirecting" }) {
  const messages: Record<typeof stage, string> = {
    authenticating: "Verifying your credentials…",
    profile:        "Loading your profile…",
    redirecting:    "Redirecting to your dashboard…",
  };

  const steps: { key: typeof stage; label: string }[] = [
    { key: "authenticating", label: "Authenticate" },
    { key: "profile",        label: "Load Profile" },
    { key: "redirecting",    label: "Redirect"      },
  ];
  const order: (typeof stage)[] = ["authenticating", "profile", "redirecting"];
  const currentIdx = order.indexOf(stage);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center"
      style={{ backgroundColor: "rgba(10,31,60,0.55)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white rounded-3xl shadow-2xl px-10 py-9 flex flex-col items-center max-w-[340px] w-full mx-4">

        {/* Spinner with logo */}
        <div className="relative w-20 h-20 mb-6">
          <svg className="w-20 h-20 animate-spin" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke="#00355f" strokeWidth="6" strokeLinecap="round"
              strokeDasharray="180 213"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={logo} alt="" className="w-9 h-9 object-contain"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          </div>
        </div>

        <p className="text-[16px] font-bold text-[#00355f] text-center">{messages[stage]}</p>
        <p className="text-[13px] text-slate-400 mt-1 text-center">Please wait a moment</p>

        {/* Step progress */}
        <div className="flex items-center gap-1.5 mt-6 w-full">
          {steps.map((s, i) => (
            <div key={s.key} className="flex-1 flex items-center gap-1.5">
              <div
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i < currentIdx ? "bg-emerald-400" : i === currentIdx ? "bg-[#00355f]" : "bg-slate-150"
                }`}
                style={i === currentIdx ? { backgroundColor: "#00355f" } : i < currentIdx ? {} : { backgroundColor: "#e2e8f0" }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between w-full mt-2">
          {steps.map((s, i) => (
            <span key={s.key} className={`text-[10px] font-bold uppercase tracking-wide ${
              i <= currentIdx ? "text-[#00355f]" : "text-slate-300"
            }`}>
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { toasts, add: toast, dismiss } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [stage,    setStage]    = useState<"idle" | "authenticating" | "profile" | "redirecting">("idle");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      // ── 1. Authenticate ──────────────────────────────────────────────
      setStage("authenticating");
      const loginRes = await loginUser({ username, password });
      const token = loginRes.access || loginRes.token;

      if (!token) {
        throw new Error("No token returned from server.");
      }
      localStorage.setItem("access", token);

      // ── 2. Fetch profile ─────────────────────────────────────────────
      setStage("profile");
      const profile = await getProfile();
      const role = profile.role as Role;

      if (!ROLE_HOME[role]) {
        throw new Error("Unrecognized account role. Please contact your administrator.");
      }

      const user = {
        name: profile.user.full_name,
        role,
        initials: profile.user.full_name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase(),
        email:      profile.user.email,
        department: profile.department,
        employeeId: profile.employee_id,
      };

      localStorage.setItem("user", JSON.stringify(user));
      if (remember) localStorage.setItem("remember", "true");
      else localStorage.removeItem("remember");

      // ── 3. Redirect ───────────────────────────────────────────────────
      setStage("redirecting");
      toast("success", `Welcome back, ${user.name.split(" ")[0]}!`);

      setTimeout(() => {
        navigate(ROLE_HOME[role], { replace: true });
      }, 700);

    } catch (err: any) {
      setStage("idle");
      localStorage.removeItem("access");
      localStorage.removeItem("user");

      const message =
        err.response?.data?.detail ||
        err.message ||
        "Login failed. Please check your credentials and try again.";

      setError(message);
      toast("error", message);
    }
  };

  const inputCls =
    "w-full pl-12 pr-4 py-4 rounded-xl text-[16px] bg-white border-2 border-slate-200 text-[#1a2e3f] placeholder:text-slate-400 outline-none transition-all focus:border-[#00355f] focus:ring-4 focus:ring-[#00355f]/10";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-5"
      style={{ backgroundColor: "#f0f4f8" }}
    >
      <ToastContainer toasts={toasts} dismiss={dismiss} />
      {stage !== "idle" && <LoadingOverlay stage={stage} />}

      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <div
        className="w-full max-w-[460px] bg-white rounded-3xl overflow-hidden"
        style={{ boxShadow: "0 8px 48px rgba(0,53,95,0.14), 0 2px 8px rgba(0,53,95,0.08)" }}
      >
        <div className="h-2 w-full" style={{ background: "linear-gradient(90deg,#00355f,#2563eb,#60a5fa)" }} />

        <div className="flex flex-col items-center px-10 pt-10 pb-8" style={{ backgroundColor: "#00355f" }}>
          <div
            className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center mb-5 overflow-hidden"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}
          >
            <img
              src={logo}
              alt="Petty Cash System"
              className="w-14 h-14 object-contain"
              onError={(e) => {
                const t = e.currentTarget as HTMLImageElement;
                t.style.display = "none";
                const p = t.parentElement;
                if (p)
                  p.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00355f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
              }}
            />
          </div>
          <h1 className="text-[26px] font-extrabold text-white tracking-tight">Petty Cash System</h1>
          <p className="text-[14px] font-medium mt-1.5" style={{ color: "#93c5fd" }}>
            IT Finance Management
          </p>
        </div>

        <div className="px-10 py-9">
          <h2 className="text-[22px] font-bold text-[#00355f] mb-1">Welcome back</h2>
          <p className="text-[15px] text-slate-500 mb-7">Sign in to your account to continue.</p>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-[15px] font-bold text-[#1a2e3f]">
                Username
              </label>
              <div className="relative">
                <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder="Enter your username"
                  autoComplete="username"
                  disabled={stage !== "idle"}
                  className={`${inputCls} disabled:opacity-60 disabled:cursor-not-allowed`}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[15px] font-bold text-[#1a2e3f]">
                  Password
                </label>
                <a href="#" className="text-[14px] font-semibold text-[#2563eb] hover:text-[#00355f] transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={stage !== "idle"}
                  className={`${inputCls} pr-12 disabled:opacity-60 disabled:cursor-not-allowed`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  disabled={stage !== "idle"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00355f] transition-colors disabled:opacity-50"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label
              className={`flex items-center gap-3 select-none ${stage !== "idle" ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => stage === "idle" && setRemember((v) => !v)}
            >
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all border-2"
                style={{
                  backgroundColor: remember ? "#00355f" : "transparent",
                  borderColor: remember ? "#00355f" : "#cbd5e1",
                }}
              >
                {remember && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-[15px] font-medium text-slate-600">Remember this workstation</span>
            </label>

            {/* Inline error (kept alongside toast for accessibility/persistence) */}
            {error && (
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium"
                style={{ backgroundColor: "#fef2f2", border: "1.5px solid #fecaca", color: "#dc2626" }}
              >
                <AlertTriangle size={18} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={stage !== "idle"}
              className="w-full py-4 rounded-xl text-[17px] font-bold flex items-center justify-center gap-2.5 transition-all mt-2 disabled:cursor-not-allowed"
              style={
                stage === "idle"
                  ? { backgroundColor: "#00355f", color: "#fff", boxShadow: "0 4px 16px rgba(0,53,95,0.3)" }
                  : { backgroundColor: "#1e40af", color: "#fff", opacity: 0.85 }
              }
            >
              {stage === "idle"
                ? <><span>Sign In</span><ArrowRight size={20} /></>
                : <><Loader2 size={20} className="animate-spin" /><span>Signing in…</span></>
              }
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-2 px-10 py-5 border-t border-slate-100" style={{ backgroundColor: "#f8fafc" }}>
          <ShieldCheck size={16} style={{ color: "#00355f" }} />
          <p className="text-[13px] font-medium text-slate-500 text-center">
            Authorized personnel only · IT Finance Department
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-6">
        {["Privacy Policy", "Terms of Service", "Support"].map((link) => (
          <a key={link} href="#" className="text-[13px] font-medium text-slate-400 hover:text-[#00355f] transition-colors">
            {link}
          </a>
        ))}
      </div>
      <p className="text-[12px] text-slate-400 mt-2">v2.4.0-PRO</p>
    </div>
  );
}