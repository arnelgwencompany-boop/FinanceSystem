import { Trash2, X } from "lucide-react";
import type { Request } from "../../../types/requestList";

interface Props {
  req:      Request | null;
  onClose:  () => void;
  onConfirm: (req: Request) => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({ req, onClose, onConfirm, loading }: Props) {
  if (!req) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
              <Trash2 size={17} className="text-red-500" />
            </div>
            <h2 className="text-[16px] font-extrabold text-[#1a2e3f]">Delete Request</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-[14px] text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-bold text-[#1a2e3f]">{req.request_no}</span>?
          </p>
          <p className="mt-1 text-[13px] text-slate-400">
            "{req.description}"
          </p>
          <p className="mt-3 text-[12px] text-red-500">
            This action cannot be undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-[13px] font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(req)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
          >
            {loading
              ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Deleting…</>
              : <><Trash2 size={14} /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}