"use client";

import { useState, useEffect, useCallback } from "react";

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt: string;
}



export default function DashboardPage() {
  const [access, setAccess] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ✅ Single reusable fetch function
  const fetchData = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const res = await fetch("/api/contact", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const json = await res.json();
    if (Array.isArray(json)) {
      setData(json);
    } else {
      setData([]);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setError("Failed to load data. Please try refreshing.");
    setData([]);
  } finally {
    setIsLoading(false);
  }
}, []);

  // 🔄 Fetch data AFTER login
  useEffect(() => {
    if (access) {
      fetchData();
    }
  }, [access, fetchData]);

  // ✅ Handle login via API instead of client-side check
  const handleLogin = async () => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAccess(true);
        setPassword("");
      } else {
        alert("Wrong password");
      }
    } catch {
      alert("Login failed. Please try again.");
    }
  };

  // 🔒 LOGIN SCREEN
  if (!access) {
    return (
      <div
        style={{
          padding: "40px",
          maxWidth: "300px",
          margin: "120px auto",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Admin Login</h2>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            background: "#D96A1A",
            color: "white",
            padding: "10px",
            width: "100%",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Enter
        </button>
      </div>
    );
  }

  const filteredData =
    filter === "all" ? data : data.filter((item) => item.service === filter);

  // 📊 DASHBOARD VIEW
  return (
    <main style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h1 style={{ fontSize: "28px" }}>Dashboard</h1>

        {/* ✅ Refresh button using fetchData */}
        <button
          onClick={fetchData}
          disabled={isLoading}
          style={{
            background: "#D96A1A",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "5px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "8px",
          borderRadius: "5px",
        }}
      >
        <option value="all">All</option>
        <option value="Electrical">Electrical</option>
        <option value="Mechanical">Mechanical</option>
        <option value="Fire Safety">Fire Safety</option>
        <option value="Commercial">Commercial</option>
        <option value="AMC">AMC</option>
      </select>

      <hr style={{ marginBottom: "20px" }} />

      {/* ✅ Loading state */}
      {isLoading && <p style={{ opacity: 0.7 }}>Loading enquiries...</p>}

      {/* ✅ Error state */}
      {error && <p style={{ color: "#ff4d4d" }}>{error}</p>}

      {/* Empty state */}
      {!isLoading && !error && filteredData.length === 0 && (
        <p style={{ opacity: 0.7 }}>No enquiries yet</p>
      )}

      {/* DATA CARDS */}
      {filteredData.map((item) => (
        <div
          key={item._id ?? item.email}
          style={{
            background: "#1a1a1a",
            color: "white",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "15px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>{item.name}</h3>

          <p>
            <strong>Email:</strong> {item.email}
          </p>

          {/* ✅ Copy email with visual feedback */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(item.email);
              setCopiedId(item._id);
              setTimeout(() => setCopiedId(null), 2000);
            }}
            style={{
              marginTop: "6px",
              fontSize: "12px",
              cursor: "pointer",
              color: copiedId === item._id ? "#4caf50" : "#D96A1A",
              background: "none",
              border: "none",
              padding: 0,
            }}
          >
            {copiedId === item._id ? "Copied!" : "Copy Email"}
          </button>

          <p>
            <strong>Phone:</strong> {item.phone}
          </p>
          <p>
            <strong>Service:</strong> {item.service}
          </p>
          <p>
            <strong>Message:</strong> {item.message}
          </p>

          <p style={{ marginTop: "8px", fontSize: "12px", color: "#aaa" }}>
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </main>
  );

}
