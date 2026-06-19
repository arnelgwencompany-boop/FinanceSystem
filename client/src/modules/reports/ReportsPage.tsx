// src/pages/Reports.tsx
import React, { useState, useMemo } from 'react';

type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
};

const mockData: Transaction[] = [
  { id: 1, date: '2026-06-01', description: 'Office Supplies', amount: 500, category: 'Supplies' },
  { id: 2, date: '2026-06-03', description: 'Snacks', amount: 300, category: 'Food' },
  { id: 3, date: '2026-06-05', description: 'Transport', amount: 200, category: 'Travel' },
  { id: 4, date: '2026-06-10', description: 'Printer Ink', amount: 700, category: 'Supplies' },
];

const Reports: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      if (!startDate || !endDate) return true;
      return item.date >= startDate && item.date <= endDate;
    });
  }, [startDate, endDate]);

  const totalAmount = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredData]);

  const groupedByCategory = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredData.forEach((item) => {
      grouped[item.category] = (grouped[item.category] || 0) + item.amount;
    });
    return grouped;
  }, [filteredData]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Reports</h2>

      {/* Filters */}
      <div style={{ marginBottom: '20px' }}>
        <label>Start Date: </label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <label style={{ marginLeft: '10px' }}>End Date: </label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      {/* Summary */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Total Expenses: ₱{totalAmount}</h3>
      </div>

      {/* Table */}
      <table border={1} cellPadding={8} width="100%">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>₱{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Category Summary */}
      <div style={{ marginTop: '30px' }}>
        <h3>Expenses by Category</h3>
        <ul>
          {Object.entries(groupedByCategory).map(([category, amount]) => (
            <li key={category}>
              {category}: ₱{amount}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Reports;