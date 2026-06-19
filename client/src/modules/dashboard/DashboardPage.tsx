export default function DashboardPage() {
  // 🔹 Mock data (for prototype)
  const summary = {
    income: 50000,
    expenses: 32000,
    balance: 18000,
  };

  const transactions = [
    {
      id: 1,
      date: "2026-06-18",
      department: "IT",
      type: "Expense",
      category: "Hardware",
      amount: 5000,
      status: "Approved",
    },
    {
      id: 2,
      date: "2026-06-17",
      department: "Finance",
      type: "Income",
      category: "Budget",
      amount: 20000,
      status: "Pending",
    },
    {
      id: 3,
      date: "2026-06-16",
      department: "IT",
      type: "Expense",
      category: "Software",
      amount: 3000,
      status: "Rejected",
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <h1 className="text-xl font-semibold">Dashboard</h1>

      {/* 🔹 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Income</p>
          <h2 className="text-lg font-bold">₱ {summary.income}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <h2 className="text-lg font-bold">₱ {summary.expenses}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Petty Cash Balance</p>
          <h2 className="text-lg font-bold">₱ {summary.balance}</h2>
        </div>

      </div>

      {/* 🔹 Recent Transactions */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-md font-semibold mb-3">Recent Transactions</h2>

        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
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
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      t.status === "Approved"
                        ? "bg-green-100 text-green-600"
                        : t.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}