"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [access, setAccess] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState([]);

  // fetch data AFTER access granted
  useEffect(() => {
    if (access) {
      fetch("/api/contact")
        .then((res) => res.json())
        .then((res) => setData(res));
    }
  }, [access]);

  // 🔒 LOGIN SCREEN
  if (!access) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Admin Login</h2>

        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => {
            if (password === "admin123") {
              setAccess(true);
            } else {
              alert("Wrong password");
            }
          }}
        >
          Enter
        </button>
      </div>
    );
  }

  // 📊 DASHBOARD (after login)
  return (
    <main style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      {data.length === 0 && <p>No messages yet</p>}

      {data.map((item: any) => (
        <div key={item._id} style={{ marginBottom: "15px" }}>
          <h3>{item.name}</h3>
          <p>Email: {item.email}</p>
          <p>Phone: {item.phone}</p>
          <p>Message: {item.message}</p>
        </div>
      ))}
    </main>
  );
}