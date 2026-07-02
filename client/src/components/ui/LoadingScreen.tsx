interface LoadingScreenProps {
  message?: string;
  description?: string;
}

export default function LoadingScreen({
  message = "Processing Request",
  description = "Please wait while we update our system...",
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/20 backdrop-blur-sm animate-fade-in">
      <style>{`
        .doc-brand { color: #00355f; }
        .doc-border-brand { border-color: #00355f; }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>

      <div className="flex w-full max-w-xs flex-col items-center rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xl">
        {/* Modern Spinner */}
        <div className="relative mb-5 h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-4 doc-border-brand border-t-transparent animate-spin" />
        </div>

        {/* Text Details */}
        <h3 className="text-base font-bold text-slate-900">{message}</h3>
        {description && (
          <p className="mt-1 text-xs font-medium text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}