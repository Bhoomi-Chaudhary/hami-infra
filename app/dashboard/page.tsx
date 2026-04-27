

"use client";

import { useState, useEffect } from "react";


export default function DashboardPage() {
  const [access, setAccess] = useState(false);
  const [password, setPassword] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");


    const fetchData = () => {
  fetch("/api/contact", {
    cache: "no-store",
  })
    .then((res) => res.json())
    .then((res) => {
      if (Array.isArray(res)) {
        setData(res);
      } else {
        console.error("Expected array, got:", res);
        setData([]);
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setData([]);
    });
};



  // 🔄 Fetch data AFTER login
  useEffect(() => {
    if (access) {
      fetch("/api/contact", {
  cache: "no-store"
})
        .then((res) => res.json())
        .then((res) => {
          if (Array.isArray(res)) {
            setData(res);
          } else {
            console.error("Expected array, got:", res);
            setData([]);
          }
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setData([]);
        });
    }
  }, [access]);

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
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={() => {
            if (password === "admin123") {
              setAccess(true);
              setPassword(""); // clear after login
            } else {
              alert("Wrong password");
            }
          }}
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
  filter === "all"
    ? data
    : data.filter((item) => item.service === filter);

  // 📊 DASHBOARD VIEW
  return (
    <main style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
        Dashboard
      </h1>

    <select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  style={{
    marginBottom: "20px",
    padding: "8px",
    borderRadius: "5px"
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

      {/* EMPTY STATE */}
      {filteredData.length === 0 && (
        <p style={{ opacity: 0.7 }}>No enquiries yet</p>
      )}

      {/* DATA CARDS */}
      {Array.isArray(data) &&
        filteredData.map((item: any) => (
          <div
            key={item._id}
            style={{
              background: "#1a1a1a",
              color: "white",
              padding: "16px",
              borderRadius: "8px",
              marginBottom: "15px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>
              {item.name}
            </h3>

            <p>
  <strong>Email:</strong> {item.email}
</p>

<button
  onClick={() => {
    navigator.clipboard.writeText(item.email);
  }}
  style={{
    marginTop: "6px",
    fontSize: "12px",
    cursor: "pointer",
    color: "#D96A1A",
    background: "none",
    border: "none",
    padding: 0
  }}
>
  Copy Email
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

            <p
              style={{
                marginTop: "8px",
                fontSize: "12px",
                color: "#aaa",
              }}
            >
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
    </main>
  );
}