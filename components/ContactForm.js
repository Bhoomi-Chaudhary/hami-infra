"use client";
import { useState, useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRouter } from "next/navigation";

export default function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("error");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false); // ✅ success state

  const showToast = (msg, type = "error") => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    };
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
      isValid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
      isValid = false;
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
      isValid = false;
    }

    if (!form.service) {
      newErrors.service = "Please select a service.";
      isValid = false;
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required.";
      isValid = false;
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setShowConfirm(true);
  };

  const checkEmailExists = async (email) => {
    // Uncomment when ready to enable Abstract API check
    // try {
    //   const res = await fetch(
    //     `https://emailreputation.abstractapi.com/v1/?api_key=${process.env.NEXT_PUBLIC_ABSTRACT_API_KEY}&email=${email}`
    //   );
    //   const data = await res.json();
    //   console.log("Email check response:", data);

    //   // ✅ Block if email format is invalid
    //   if (data.email_deliverability?.is_format_valid === false) {
    //     setErrors((prev) => ({ ...prev, email: "This email address format is invalid." }));
    //     return false;
    //   }

    //   // ✅ Block if email is undeliverable
    //   if (data.email_deliverability?.status === "undeliverable") {
    //     setErrors((prev) => ({ ...prev, email: "This email address does not exist or is invalid." }));
    //     return false;
    //   }

    //   // ✅ Block disposable emails
    //   if (data.email_quality?.is_disposable === true) {
    //     setErrors((prev) => ({ ...prev, email: "Disposable emails are not allowed." }));
    //     return false;
    //   }

    //   // ✅ Block high risk emails
    //   if (data.email_risk?.address_risk_status === "high") {
    //     setErrors((prev) => ({ ...prev, email: "This email address appears to be invalid." }));
    //     return false;
    //   }

    //   return true;
    // } catch (error) {
    //   console.error("Email check error:", error);
    //   return true;
    // }
    return true;
  };

  const submitForm = useCallback(async () => {
    setShowConfirm(false);

    if (loading) return;

    if (!executeRecaptcha) {
      showToast("reCAPTCHA not ready, please try again");
      return;
    }

    setLoading(true);

    try {
      const emailValid = await checkEmailExists(form.email);
      if (!emailValid) {
        setLoading(false);
        return;
      }

      const token = await executeRecaptcha("contact_form");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, recaptchaToken: token }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Something went wrong");
        return;
      }

      // ✅ Show success screen
      setSubmitted(true);

    } catch (error) {
      console.error(error);
      showToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [form, loading, executeRecaptcha]);

  const inputClass = (field) =>
    `w-full p-3 rounded-md bg-white text-gray-800 border ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  // ✅ SUCCESS SCREEN
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6">
        {/* Checkmark */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">
          Thank You!
        </h2>

        <p className="text-gray-300 text-lg mb-2">
          Your enquiry has been submitted successfully.
        </p>

        <p className="text-gray-400 mb-10">
          We will get back to you as soon as possible.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-3 rounded-md font-semibold bg-[#D96A1A] text-white hover:opacity-90 transition active:scale-95"
          >
            Back to Home
          </button>

          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ name: "", email: "", phone: "", service: "", message: "" });
              setErrors({ name: "", email: "", phone: "", service: "", message: "" });
            }}
            className="flex-1 py-3 rounded-md font-semibold border border-white text-white hover:bg-white hover:text-[#0B1F3A] transition active:scale-95"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-[#F5F7FA] p-6 rounded-lg shadow-md"
        noValidate
      >
        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={inputClass("name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={inputClass("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={inputClass("phone")}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Service */}
        <div>
          <select
            value={form.service}
            onChange={(e) => handleChange("service", e.target.value)}
            className={inputClass("service")}
          >
            <option value="">Select Service</option>
            <option value="Electrical">Electrical</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Fire Safety">Fire Safety</option>
            <option value="Commercial">Commercial</option>
            <option value="AMC">AMC</option>
          </select>
          {errors.service && (
            <p className="text-red-500 text-sm mt-1">{errors.service}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <textarea
            placeholder="Your Message"
            rows={4}
            value={form.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className={inputClass("message")}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
          )}
        </div>

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

      {/* CONFIRM MODAL */}
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

      {/* TOAST */}
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
