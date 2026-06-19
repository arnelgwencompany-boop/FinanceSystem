// src/pages/Approvals.tsx
import React, { useState } from 'react';

type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

const initialData: Transaction[] = [
  { id: 1, date: '2026-06-01', description: 'Office Supplies', amount: 500, category: 'Supplies', status: 'Pending' },
  { id: 2, date: '2026-06-03', description: 'Snacks', amount: 300, category: 'Food', status: 'Pending' },
  { id: 3, date: '2026-06-05', description: 'Transport', amount: 200, category: 'Travel', status: 'Approved' },
];

const Approvals: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialData);

  const handleApprove = (id: number) => {
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Approved' } : item
      )
    );
  };

  const handleReject = (id: number) => {
    setTransactions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Rejected' } : item
      )
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Approvals</h2>

      <table border={1} cellPadding={8} width="100%">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>₱{item.amount}</td>
              <td>{item.status}</td>

              <td>
                {item.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleApprove(item.id)}
                      style={{ marginRight: '5px' }}
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(item.id)}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span>No actions</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Approvals;