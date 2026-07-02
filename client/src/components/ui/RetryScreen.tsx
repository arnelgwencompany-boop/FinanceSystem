import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

interface RetryScreenProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  onCancel?: () => void;
}

export default function RetryScreen({
  title = "Submission Failed",
  message = "We encountered a network error while handling your request. Please confirm your internet connection and try again.",
  onRetry,
  onCancel,
}: RetryScreenProps) {
  return (
    <div className="flex min-h-[520px] items-center justify-center p-8">
      <style>{`
        .doc-ink { color: #1a2e3f; }
        .doc-brand { color: #00355f; }
        .doc-btn-primary { background-color: #00355f; }
        .doc-btn-primary:hover { background-color: #0f4c81; }
      `}</style>

      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-zinc-200 bg-white p-12 text-center shadow-sm animate-fade-in">
        {/* Modern Warn Icon Box */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle size={40} />
        </div>

        {/* Messaging */}
        <h2 className="mb-3 text-2xl font-extrabold doc-ink">{title}</h2>
        <p className="mb-8 text-sm leading-relaxed text-slate-400">{message}</p>

        {/* Action Controls */}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors order-2 sm:order-1"
            >
              <ArrowLeft size={16} /> Cancel
            </button>
          )}
          <button
            type="button"
            onClick={onRetry}
            className="doc-btn-primary flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors order-1 sm:order-2"
          >
            <RefreshCw size={15} /> Try Again
          </button>
        </div>
      </div>
    </div>
  );
}