"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ NEW

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // ✅ prevent double click

    setLoading(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setToast("Message sent successfully");

      // optional: clear form
      setForm({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: ""
      });

    } catch (error) {
      setToast("Something went wrong");
    }

    setTimeout(() => {
      setToast(null);
    }, 2500);

    setLoading(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-[#F5F7FA] p-6 rounded-lg shadow-md"
      >

        <input
          type="text"
          placeholder="Your Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 rounded-md bg-white text-gray-800 border border-gray-300"
        />

        <input
          type="email"
          placeholder="Your Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 rounded-md bg-white text-gray-800 border border-gray-300"
        />

        <input
          type="tel"
          placeholder="Phone Number"
          required
          pattern="[0-9]{10}"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full p-3 rounded-md bg-white text-gray-800 border border-gray-300"
        />

        <select
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          className="w-full p-3 rounded-md bg-white text-gray-800 border border-gray-300"
        >
          <option value="">Select Service</option>
          <option value="Electrical">Electrical</option>
          <option value="Mechanical">Mechanical</option>
          <option value="Fire Safety">Fire Safety</option>
          <option value="Commercial">Commercial</option>
          <option value="AMC">AMC</option>
        </select>

        <textarea
          placeholder="Your Message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full p-3 rounded-md bg-white text-gray-800 border border-gray-300"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#D96A1A] text-white hover:opacity-90"
          }`}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

      </form>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-5 right-5 bg-[#1a1a1a] text-white px-4 py-2 rounded-md border border-white/10 shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}