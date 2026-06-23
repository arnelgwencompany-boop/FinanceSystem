import { useState } from "react";
import ApprovalsHeader from "../../components/aprovals/ApprovalHeader";
import ApprovalsTable from "../../components/aprovals/ApprovalTable";
import ApprovalDetailPanel from "../../components/aprovals/Approvaldetalpanel";
import { MOCK_APPROVALS } from "../../data/approvalData";
import type { ApprovalTransaction } from "../../types/approvals";

export default function ApprovalsPage() {
  const [transactions, setTransactions] = useState<ApprovalTransaction[]>(MOCK_APPROVALS);

  // The selected transaction object (not just id)
  const [selected, setSelected] = useState<ApprovalTransaction | null>(null);

  // Approve or reject — updates list + refreshes the panel if it's open
  const updateStatus = (id: number, status: "Approved" | "Rejected") => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    // Keep the panel in sync with the updated status
    setSelected((prev) =>
      prev?.id === id ? { ...prev, status } : prev
    );
  };

  // Remarks update
  const updateRemarks = (id: number, remarks: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, remarks } : t))
    );
    setSelected((prev) =>
      prev?.id === id ? { ...prev, remarks } : prev
    );
  };

  return (
    <main className="ml-[240px] mt-16 p-6 md:p-8 min-h-[calc(100vh-64px)] bg-[#f7f9fb]">
      <div className="max-w-[1440px] mx-auto space-y-6">

        {/* Header + stats */}
        <ApprovalsHeader transactions={transactions} />

        {/* Split layout: table left, detail panel right */}
        <div className={`grid gap-6 ${selected ? "grid-cols-1 xl:grid-cols-[1fr_480px]" : "grid-cols-1"}`}>

          {/* Queue table */}
          <ApprovalsTable
            transactions={transactions}
            onSelect={setSelected}           // passes full ApprovalTransaction object
            selectedId={selected?.id ?? null}
            onApprove={(id) => updateStatus(id, "Approved")}
            onReject={(id) => updateStatus(id, "Rejected")}
          />

          {/* Detail panel — only renders when a row is selected */}
          {selected && (
            <ApprovalDetailPanel
              transaction={selected}
              onClose={() => setSelected(null)}
              onApprove={(id) => updateStatus(id, "Approved")}
              onReject={(id) => updateStatus(id, "Rejected")}
              onRemarksChange={updateRemarks}
            />
          )}
        </div>

      </div>
    </main>
  );
}