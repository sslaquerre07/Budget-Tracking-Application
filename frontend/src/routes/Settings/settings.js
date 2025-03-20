import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./settings.css";

const SettingsPage = () => {
  // Separate states for password update and account deletion
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  // Function to update the password
  const handlePasswordChange = async () => {
    if (!email || !newPassword) {
      setMessage("Email and password cannot be empty!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/user/updatePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword }),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        setMessage("Password updated successfully!");
      } else {
        setMessage(`Error: ${data.response || "Failed to update password"}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      setMessage("Network error: Could not connect to the server");
    }
  };

  // Function to delete the account
  const handleDeleteAccount = async () => {
    if (!deleteEmail || !deletePassword) {
      setDeleteMessage("Email and password cannot be empty!");
      return;
    }

    try {
      console.log("Sending request with:", { email: deleteEmail, password: deletePassword });

      const response = await fetch("http://localhost:8080/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: deleteEmail.trim(),
          password: deletePassword.trim()
        }),
      });

      const data = await response.json();
      console.log("Server Response:", data);

      if (response.ok) {
        setDeleteMessage("Account deleted successfully!");
      } else {
        setDeleteMessage(`Error: ${data.response || "Failed to delete account"}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      setDeleteMessage("Network error: Could not connect to the server");
    }
  };

  return (
    <div className="settings-container">
      <h2 className="settings-title">User Settings</h2>

      {/* Change Password Section */}
      <div className="settings-card">
        <h3>Change Password</h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button className="save-btn" onClick={handlePasswordChange}>
          Save Password
        </button>
        {message && <p className="message">{message}</p>}
      </div>

      {/* Danger Zone - Delete Account */}
      <div className="settings-card danger-zone">
        <h3>Danger Zone</h3>
        <p>Permanently delete your account. This action cannot be undone.</p>
        <input
          type="email"
          placeholder="Enter your email"
          value={deleteEmail}
          onChange={(e) => setDeleteEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Current Password"
          value={deletePassword}
          onChange={(e) => setDeletePassword(e.target.value)}
        />
        <button className="delete-btn" onClick={handleDeleteAccount}>
          Delete Account
        </button>
        {deleteMessage && <p className="message">{deleteMessage}</p>}
      </div>
    </div>
  );
};

export default SettingsPage;