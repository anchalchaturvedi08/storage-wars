import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../config";
import Layout from "../../component/layout/Layout";
import api from "../../api/axios";
import "./Contact.css";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const recaptchaRef = useRef(null);

  const resetCaptcha = () => {
    recaptchaRef.current?.reset();
    setRecaptchaToken("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      setStatus("Please complete the reCAPTCHA.");
      return;
    }

    try {
      await api.post("/contact", {
        ...formData,
        recaptchaToken
      });

      setStatus("Message submitted successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("CONTACT ERROR:", error);
      setStatus(
        error.response?.data?.message || "Failed to submit message."
      );
    }

    // Reset in both cases: the user stays on this page, and a v2 token
    // cannot be reused for a second submission.
    resetCaptcha();
  };

  return (
    <Layout>
      <main className="container-x flex justify-center py-14">
        <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-soft sm:p-10">

          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[.2em] text-gold">
              Get in touch
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Contact Us
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted">
              Questions about an auction, a listing or your account? Send us a
              message and we will reply to the address you give below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">

            <label className="block text-sm font-bold">
              Full Name
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="mt-2 w-full rounded-xl border p-3 font-normal"
              />
            </label>

            <label className="block text-sm font-bold">
              Email Address
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border p-3 font-normal"
              />
            </label>

            <label className="block text-sm font-bold">
              Message
              <textarea
                required
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we help?"
                className="mt-2 w-full rounded-xl border p-3 font-normal"
              />
            </label>

            <div className="flex justify-center pt-1">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={(token) => setRecaptchaToken(token || "")}
                onExpired={() => setRecaptchaToken("")}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-ink p-3.5 font-bold text-white transition hover:opacity-90"
            >
              Send Message
            </button>

            {status && (
              <p
                className={
                  "pt-1 text-center text-sm font-bold " +
                  (status.includes("success") ? "text-green-700" : "text-red-600")
                }
              >
                {status}
              </p>
            )}
          </form>
        </div>
      </main>
    </Layout>
  );
}

export default Contact;