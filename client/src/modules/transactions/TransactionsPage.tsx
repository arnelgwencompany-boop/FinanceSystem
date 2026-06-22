import { useState } from "react";
import type { Transaction } from "../../types/transactions";
import type { TransactionFormValues } from "../../types/transactions";
import { EMPTY_FORM } from "../../types/transactions";
import PageHeader from "../../components/transactions/PageHeader";
import StatCards from "../../components/transactions/StatCards";
import TransactionForm from "../../components/transactions/TransactionForm";
import TransactionTable from "../../components/transactions/TransactionTable";
import EditModal from "../../components/transactions/EditModal";

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    department: "GA",
    unit: "0",
    item: "1",
    date: "2026-01-25",
    description: "Headphone set (500 pcs)",
    payOut: 3000.9,
    VAT: 252.4,
    withoutVAT: 2102.5,
    deliveryFee: 394,
    balance: 97000.1,
    status: "Completed",
  },
  {
    id: 2,
    department: "GO",
    unit: "0",
    item: "2",
    date: "2026-01-11",
    description: "Humidity Temperature sensor",
    payOut: 2000.5,
    VAT: 0,
    withoutVAT: 178,
    deliveryFee: 58.5,
    balance: 95000.6,
    status: "Completed",
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [form, setForm] = useState<TransactionFormValues>(EMPTY_FORM);
  const [income, setIncome] = useState(0);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx: Transaction = {
      id: Date.now(),
      department: form.department,
      unit: form.unit,
      item: form.item,
      date: form.date,
      description: form.description,
      payOut: Number(form.payOut),
      VAT: Number(form.VAT),
      withoutVAT: Number(form.withoutVAT),
      deliveryFee: Number(form.deliveryFee),
      balance: Number(form.balance),
      status: "Pending",
    };
    setTransactions((prev) => [newTx, ...prev]);
    setForm(EMPTY_FORM);
  };

  const handleBulkImport = (rows: Omit<Transaction, "id">[]) => {
    const imported = rows.map((r, i) => ({ ...r, id: Date.now() + i }));
    setTransactions((prev) => [...prev, ...imported]);
  };

  const handleDelete = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveEdit = (updated: Transaction) => {
    setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  return (
    <main className="ml-[240px] mt-16 p-8 min-h-[calc(100vh-64px)] bg-[#f7f9fb]">
      <div className="max-w-[1750px] mx-auto space-y-6">

        <PageHeader transactions={transactions} />

        <StatCards transactions={transactions} income={income} />

        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Left: Form */}
          <div className="col-span-12 xl:col-span-4">
            <TransactionForm
              form={form}
              income={income}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              onIncomeChange={setIncome}
              onBulkImport={handleBulkImport}
            />
          </div>

          {/* Right: Table */}
          <div className="col-span-12 xl:col-span-8">
            <TransactionTable
              transactions={transactions}
              onDelete={handleDelete}
              onEdit={setEditTarget}
            />
          </div>
        </div>

      </div>

      <EditModal
        transaction={editTarget}
        onClose={() => setEditTarget(null)}
        onSave={handleSaveEdit}
      />
    </main>
  );
}