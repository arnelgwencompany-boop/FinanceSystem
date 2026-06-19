import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Landmark, 
  User, 
  Lock, 
  ArrowRight, 
  Loader2, 
  CheckCircle2 
} from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [progressWidth, setProgressWidth] = useState(33);

  // Subtle pulse on progress bar for "system health" feel
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressWidth((prev) => (prev === 33 ? 38 : 33));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    setStatus("loading");

    // Simulate login and success states
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#191c1e] font-sans">
      
      {/* Subtle Background Ambient Movement */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] bg-[#a0c9ff]"></div>
        <div className="absolute top-[60%] -right-[5%] w-[35%] h-[35%] rounded-full blur-[100px] bg-[#d3e4fe]"></div>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 relative z-10">
        <div className="w-full max-w-[400px]">
          
          {/* Minimal Branding Anchor */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-12 h-12 bg-[#00355f] rounded-lg flex items-center justify-center mb-4 text-white shadow-sm">
              <Landmark size={28} strokeWidth={1.5} />
            </div>
            <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.02em] text-[#00355f]">
              Asset Ledger
            </h1>
            <p className="text-[13px] text-[#505f76] mt-1">
              Enterprise Asset & Financial Management
            </p>
          </div>

          {/* Transactional Card */}
          <div className="bg-white border border-[#E2E8F0] p-8 rounded-xl shadow-sm">
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Username Field */}
              <div className="space-y-1">
                <label 
                  htmlFor="username" 
                  className="text-[11px] leading-[16px] tracking-[0.05em] font-bold uppercase text-[#505f76]"
                >
                  Username
                </label>
                <div className="relative mt-1">
                  <User 
                    size={18} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#727780]" 
                  />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your ID or email"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-[36px] pl-10 pr-4 bg-[#ffffff] border border-[#c2c7d1] rounded-lg text-[14px] placeholder:text-[#727780]/50 transition-all focus:outline-none focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f]"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label 
                    htmlFor="password" 
                    className="text-[11px] leading-[16px] tracking-[0.05em] font-bold uppercase text-[#505f76]"
                  >
                    Password
                  </label>
                  <a href="#" className="text-[11px] leading-[16px] tracking-[0.05em] font-bold uppercase text-[#00355f] hover:underline transition-all">
                    Forgot?
                  </a>
                </div>
                <div className="relative mt-1">
                  <Lock 
                    size={18} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#727780]" 
                  />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-[36px] pl-10 pr-4 bg-[#ffffff] border border-[#c2c7d1] rounded-lg text-[14px] placeholder:text-[#727780]/50 transition-all focus:outline-none focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f]"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center gap-2 pt-1">
                <input 
                  id="remember" 
                  type="checkbox" 
                  className="w-4 h-4 border-[#c2c7d1] rounded text-[#00355f] focus:ring-[#00355f]"
                />
                <label htmlFor="remember" className="text-[13px] text-[#42474f]">
                  Remember this workstation
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={status !== "idle"}
                className={`w-full h-10 mt-4 text-white text-[16px] font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm ${
                  status === "success" ? "bg-green-700" : "bg-[#00355f]"
                }`}
              >
                {status === "idle" && (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
                {status === "loading" && (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Authenticating...
                  </>
                )}
                {status === "success" && (
                  <>
                    <CheckCircle2 size={18} />
                    Success
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Single Secondary Image/Graphic for Professionalism */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="w-full h-1 bg-[#c2c7d1] rounded-full overflow-hidden opacity-30">
              <div 
                className="h-full bg-[#00355f] transition-all duration-1000 ease-in-out" 
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>
            <p className="text-[11px] leading-[16px] tracking-[0.05em] font-bold uppercase text-[#727780] text-center">
              Authorized Access Only
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 flex flex-col md:flex-row justify-between items-center border-t border-[#c2c7d1]/30 gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <span className="text-[11px] leading-[16px] tracking-[0.05em] font-bold uppercase text-[#505f76]">
            IT Finance Department
          </span>
          <div className="w-1 h-1 bg-[#727780] rounded-full hidden md:block"></div>
          <span className="text-[13px] text-[#727780]">
            v4.2.1-stable
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-[11px] leading-[16px] tracking-[0.05em] font-bold uppercase text-[#505f76] hover:text-[#00355f] transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-[11px] leading-[16px] tracking-[0.05em] font-bold uppercase text-[#505f76] hover:text-[#00355f] transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-[11px] leading-[16px] tracking-[0.05em] font-bold uppercase text-[#505f76] hover:text-[#00355f] transition-colors">
            Support
          </a>
        </div>
      </footer>
    </div>
  );
}