// src/pages/Settings.tsx
import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [name, setName] = useState('Juan Dela Cruz');
  const [email, setEmail] = useState('juan@example.com');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('light');

  const handleSaveProfile = () => {
    alert('Profile updated!');
    console.log({ name, email });
  };

  const handleChangePassword = () => {
    if (!password) return alert('Enter new password');
    alert('Password changed!');
    setPassword('');
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    alert(`Theme changed to ${value}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>Settings</h2>

      {/* Profile Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Profile</h3>

        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>

        <button onClick={handleSaveProfile}>Save Profile</button>
      </div>

      {/* Password Section */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Change Password</h3>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />

        <button onClick={handleChangePassword}>Update Password</button>
      </div>

      {/* Preferences Section */}
      <div>
        <h3>Preferences</h3>

        <label>Theme:</label>
        <select
          value={theme}
          onChange={(e) => handleThemeChange(e.target.value)}
          style={{ marginLeft: '10px' }}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;