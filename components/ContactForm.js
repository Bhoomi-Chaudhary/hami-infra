"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(form),
    });

    alert("Message sent!");
  };

  return (
    <section style={{
      padding: "60px 20px",
      background: "#F5F7FA"
    }}>
      <h2 style={{
        textAlign: "center",
        marginBottom: "30px",
        color: "#0B1F3A"
      }}>
        Contact Us
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <input
          placeholder="Name"
          required
          style={inputStyle}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          required
          style={inputStyle}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="Phone"
          style={inputStyle}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <textarea
          placeholder="Message"
          required
          style={{ ...inputStyle, height: "100px" }}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <button
          type="submit"
          style={{
            background: "#D96A1A",
            color: "white",
            padding: "12px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Send Message
        </button>
      </form>
    </section>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};