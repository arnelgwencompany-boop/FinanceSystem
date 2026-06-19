// src/pages/Notifications.tsx
import React, { useState } from 'react';

type Notification = {
  id: number;
  message: string;
  date: string;
  read: boolean;
};

const initialNotifications: Notification[] = [
  { id: 1, message: 'Transaction #1 has been approved', date: '2026-06-18', read: false },
  { id: 2, message: 'Transaction #2 has been rejected', date: '2026-06-17', read: false },
  { id: 3, message: 'New transaction submitted for approval', date: '2026-06-16', read: true },
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Notifications</h2>

      <button onClick={markAllAsRead} style={{ marginBottom: '15px' }}>
        Mark All as Read
      </button>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notifications.map((notif) => (
          <li
            key={notif.id}
            style={{
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: notif.read ? '#f0f0f0' : '#d1e7ff',
              cursor: 'pointer',
            }}
            onClick={() => markAsRead(notif.id)}
          >
            <div>
              <strong>{notif.message}</strong>
            </div>
            <small>{notif.date}</small>
            {!notif.read && (
              <span style={{ marginLeft: '10px', color: 'red' }}>
                ● Unread
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;