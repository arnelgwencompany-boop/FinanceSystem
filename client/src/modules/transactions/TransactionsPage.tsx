import { useState } from "react";

type Transaction = {
  id: number;
  date: string;
  department: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  status: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [form, setForm] = useState({
    date: "",
    department: "",
    type: "Expense",
    category: "",
    amount: "",
    description: "",
  });

  // 🔹 Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Submit transaction
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTransaction: Transaction = {
      id: Date.now(),
      date: form.date,
      department: form.department,
      type: form.type,
      category: form.category,
      amount: Number(form.amount),
      description: form.description,
      status: "Pending", // 🔥 goes to approval workflow
    };

    setTransactions([newTransaction, ...transactions]);

    // reset form
    setForm({
      date: "",
      department: "",
      type: "Expense",
      category: "",
      amount: "",
      description: "",
    });
  };

  // 🔹 Delete
  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-6">
      
      <h1 className="text-xl font-semibold">Transactions</h1>

      {/* 🔹 FORM */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Add Transaction</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
          </select>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <input
            type="text"
            name="category"
            placeholder="Category (Hardware, Software)"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded col-span-2"
          />

          <button
            type="submit"
            className="col-span-2 bg-blue-500 text-white py-2 rounded"
          >
            Save & Submit
          </button>
        </form>
      </div>

      {/* 🔹 TABLE */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Transaction List</h2>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Dept</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="text-center">
                <td className="p-2 border">{t.date}</td>
                <td className="p-2 border">{t.department}</td>
                <td className="p-2 border">{t.type}</td>
                <td className="p-2 border">{t.category}</td>
                <td className="p-2 border">₱ {t.amount}</td>
                <td className="p-2 border">{t.status}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No transactions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}