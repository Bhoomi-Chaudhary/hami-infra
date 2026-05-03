"use client";
import { useState, useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("error"); // "error" | "success"
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailError, setEmailError] = useState("");

  const showToast = (msg, type = "error") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  // 🔹 Opens confirmation modal
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  // ✅ Check if email exists via Abstract API
  const checkEmailExists = async (email) => {
    try {
      const res = await fetch(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.NEXT_PUBLIC_ABSTRACT_API_KEY}&email=${email}`
      );
      const data = await res.json();

      // deliverability: "DELIVERABLE" means email exists
      if (data.deliverability === "UNDELIVERABLE") {
        setEmailError("This email address does not exist or is invalid.");
        return false;
      }

      setEmailError("");
      return true;
    } catch (error) {
      console.error("Email check error:", error);
      // If API fails, allow submission to avoid blocking real users
      return true;
    }
  };

  // 🔹 Actual submission logic
  const submitForm = useCallback(async () => {
    setShowConfirm(false);

    if (!form.service || form.service === "") {
      showToast("Please select a service");
      return;
    }

    if (loading) return;

    if (!executeRecaptcha) {
      showToast("reCAPTCHA not ready, please try again");
      return;
    }

    setLoading(true);

    try {
      // ✅ Check email existence on submit
      const emailValid = await checkEmailExists(form.email);
      if (!emailValid) {
        setLoading(false);
        return;
      }

      // ✅ Get reCAPTCHA token
      const token = await executeRecaptcha("contact_form");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...form, recaptchaToken: token }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Something went wrong");
        return;
      }

      showToast("Message sent successfully ✅", "success");

      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      showToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [form, loading, executeRecaptcha]);

  return (
    <>
      {/* FORM */}
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

        {/* ✅ Email field with inline error */}
        <div>
          <input
            type="email"
            placeholder="Your Email"
            required
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              setEmailError("");
            }}
            className={`w-full p-3 rounded-md bg-white text-gray-800 border ${
              emailError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )}
        </div>

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
          required
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
              : "bg-[#D96A1A] text-white hover:opacity-90 active:scale-95"
          }`}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {/* 🔥 CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800">
              Confirm Submission
            </h3>
            <p className="text-gray-600 mt-2">
              Are you sure you want to submit this enquiry?
            </p>
            <div className="flex justify-center gap-4 mt-5">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={submitForm}
                className="px-4 py-2 bg-[#D96A1A] text-white rounded-md"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 TOAST */}
      {toast && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded-md border shadow-lg text-white ${
            toastType === "success"
              ? "bg-green-600 border-green-400"
              : "bg-[#1a1a1a] border-white/10"
          }`}
        >
          {toast}
        </div>
      )}
    </>
  );
}
