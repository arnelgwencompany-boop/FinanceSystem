import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export default function Toast({
  message,
  type = "success",
  duration = 4000,
  onClose,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation slightly before the duration ends
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration - 300);

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const handleManualClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 250); // Match exit animation speed
  };

  const styles = {
    success: {
      bg: "bg-white/90 border-emerald-100 text-slate-900 shadow-xl shadow-emerald-950/5",
      icon: <CheckCircle2 size={22} className="text-emerald-500 animate-bounce-subtle" />,
      progress: "bg-emerald-500",
    },
    error: {
      bg: "bg-white/90 border-red-100 text-slate-900 shadow-xl shadow-red-950/5",
      icon: <AlertCircle size={22} className="text-red-500 animate-shake" />,
      progress: "bg-red-500",
    },
    info: {
      bg: "bg-white/90 border-blue-100 text-slate-900 shadow-xl shadow-blue-950/5",
      icon: <Info size={22} className="text-blue-500" />,
      progress: "bg-blue-500",
    },
  };

  return (
    <div 
      className={`fixed top-6 right-6 z-50 w-full max-w-md px-4 sm:px-0 pointer-events-auto
        ${isExiting ? "animate-toast-out" : "animate-toast-in"}`}
    >
      <style>{`
        /* Modern Spring Physics Custom Curves */
        @keyframes toastIn {
          0% { transform: translateX(40px) scale(0.92); opacity: 0; }
          70% { transform: translateX(-8px) scale(1.01); opacity: 1; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes toastOut {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-20px) scale(0.9); opacity: 0; }
        }
        @keyframes shrinkProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }

        .animate-toast-in {
          animation: toastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-toast-out {
          animation: toastOut 0.25s cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        .animate-progress {
          animation: shrinkProgress ${duration}ms linear forwards;
        }
        .animate-bounce-subtle {
          animation: bounceSubtle 2s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out 2;
        }
      `}</style>

      <div
        className={`relative flex items-center gap-4 rounded-2xl border p-4.5 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-xl overflow-hidden ${styles[type].bg}`}
      >
        {/* Animated Icon Component */}
        <div className="flex-shrink-0 flex items-center justify-center">
          {styles[type].icon}
        </div>
        
        {/* Message Text */}
        <div className="flex-1 text-[15px] font-semibold text-slate-800 leading-tight">
          {message}
        </div>
        
        {/* Minimal Close Button */}
        <button
          type="button"
          onClick={handleManualClose}
          className="flex-shrink-0 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100/80 hover:text-slate-700 transition-all active:scale-95"
        >
          <X size={15} />
        </button>

        {/* Dynamic Countdown Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-100/50">
          <div className={`h-full ${styles[type].progress} animate-progress`} />
        </div>
      </div>
    </div>
  );
}