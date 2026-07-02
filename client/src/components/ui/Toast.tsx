import { useEffect } from "react";
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
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: <CheckCircle2 size={16} className="text-emerald-600" />,
    },
    error: {
      bg: "bg-red-50 border-red-200 text-red-800",
      icon: <AlertCircle size={16} className="text-red-600" />,
    },
    info: {
      bg: "bg-blue-50 border-blue-200 text-blue-800",
      icon: <Info size={16} className="text-blue-600" />,
    },
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-slide-up">
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(1rem); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      <div
        className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg ${styles[type].bg}`}
      >
        <div className="mt-0.5 flex-shrink-0">{styles[type].icon}</div>
        <div className="flex-1 text-sm font-medium leading-normal">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}