import { useState } from "react";
import { User, Eye, EyeOff } from "lucide-react";
import { cls, FieldLabel, ToastBanner, CardSection, useToast } from "./Settingsshared";

export default function UserTab() {
  const { toast, show } = useToast();
  const [name,    setName]    = useState("Admin User");
  const [email,   setEmail]   = useState("admin@company.com");
  const [pwNew,   setPwNew]   = useState("");
  const [pwConf,  setPwConf]  = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showCon, setShowCon] = useState(false);

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      show({ type: "error", message: "Name and email are required." }); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      show({ type: "error", message: "Enter a valid email address." }); return;
    }
    if (pwNew && pwNew !== pwConf) {
      show({ type: "error", message: "Passwords do not match." }); return;
    }
    if (pwNew && pwNew.length < 8) {
      show({ type: "error", message: "Password must be at least 8 characters." }); return;
    }
    show({ type: "success", message: "Profile updated successfully." });
    setPwNew(""); setPwConf("");
  };

  const pwScore = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(pwNew)).length;
  const pwMeta  = [
    { label: "Too short", color: "bg-[#ba1a1a]", w: "15%" },
    { label: "Weak",      color: "bg-[#ba1a1a]", w: "30%" },
    { label: "Fair",      color: "bg-[#743b00]", w: "55%" },
    { label: "Good",      color: "bg-[#0f4c81]", w: "80%" },
    { label: "Strong",    color: "bg-[#3b6d11]", w: "100%" },
  ][pwScore];

  return (
    <CardSection
      header={
        <div className="flex items-center justify-between">
          <div>
            <h3 className={cls.headlineSm}>User Profile</h3>
            <p className={`${cls.bodySm} mt-1`}>Manage your personal information and security credentials.</p>
          </div>
          <div className="relative group cursor-pointer">
            <div className="w-16 h-16 rounded-full border-4 border-white shadow-md bg-[#00355f] flex items-center justify-center text-white font-bold text-xl select-none">
              AD
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <User size={18} className="text-white" />
            </div>
          </div>
        </div>
      }
      footer={
        <>
          <ToastBanner toast={toast} />
          <button className={cls.btnPrimary} onClick={handleSave}>Update Profile</button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <FieldLabel>Full Name</FieldLabel>
          <input className={cls.input} value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <FieldLabel>Admin Role</FieldLabel>
          <div className={cls.inputReadonly}>
            <span className="font-semibold text-[#0f4c81]">Super Administrator</span>
          </div>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <FieldLabel>Email Address</FieldLabel>
          <input type="email" className={cls.input} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="md:col-span-2 pt-2 border-t border-[#c2c7d1]">
          <h4 className={`${cls.headlineXs} mb-4`}>Change Password</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <FieldLabel>New Password</FieldLabel>
              <div className="relative">
                <input type={showNew ? "text" : "password"} className={`${cls.input} pr-10`}
                  placeholder="Min. 8 characters" value={pwNew} onChange={(e) => setPwNew(e.target.value)} />
                <button onClick={() => setShowNew(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#505f76] hover:text-[#00355f]">
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Confirm New Password</FieldLabel>
              <div className="relative">
                <input type={showCon ? "text" : "password"} className={`${cls.input} pr-10`}
                  placeholder="Repeat new password" value={pwConf} onChange={(e) => setPwConf(e.target.value)} />
                <button onClick={() => setShowCon(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#505f76] hover:text-[#00355f]">
                  {showCon ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>
          {pwNew && (
            <div className="mt-3">
              <div className="h-1.5 bg-[#e6e8ea] rounded-full overflow-hidden">
                <div className={`h-full ${pwMeta.color} rounded-full transition-all duration-300`} style={{ width: pwMeta.w }} />
              </div>
              <p className="text-[11px] text-[#505f76] mt-1">
                Strength: <span className="font-semibold text-[#191c1e]">{pwMeta.label}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </CardSection>
  );
}