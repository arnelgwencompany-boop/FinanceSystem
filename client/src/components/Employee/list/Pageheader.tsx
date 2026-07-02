import { FileText } from "lucide-react";

export default function PageHeader() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#00355f]">
        <FileText size={22} color="white" />
      </div>
      <div>
        <h1 className="text-[24px] font-extrabold leading-tight text-[#00355f]">
          My Requests
        </h1>
        <p className="mt-0.5 text-[15px] text-slate-500">
          Track and manage your submitted payment requests.
        </p>
      </div>
    </div>
  );
}