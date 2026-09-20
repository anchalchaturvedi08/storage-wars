import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
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
      <main className="container-x py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-widest text-gold">
            GET IN TOUCH
          </p>

          <h1 className="mt-3 text-5xl font-black">
            Contact Us
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted">
            Have a question about an auction, account or listing? Send us a message.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 grid max-w-xl gap-4">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="rounded-xl border p-3"
              placeholder="Your name"
            />

            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              type="email"
              className="rounded-xl border p-3"
              placeholder="Email"
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="rounded-xl border p-3"
              placeholder="Message"
            />

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(token) => setRecaptchaToken(token || "")}
              onExpired={() => setRecaptchaToken("")}
            />

            <button
              type="submit"
              className="rounded-xl bg-ink p-3 font-bold text-white"
            >
              Send Message
            </button>
          </form>

          {status && <p className="mt-4 font-bold">{status}</p>}
        </div>
      </main>
    </Layout>
  );
}

export default Contact;