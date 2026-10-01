import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Layout from "../../component/layout/Layout";
import api from "../../api/axios";
import { RECAPTCHA_SITE_KEY } from "../../config";

function ForgotPassword() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const recaptchaRef = useRef(null);

  // A v2 token is single use. After any submit the widget must be reset or
  // the next attempt sends a stale token and fails verification.
  const resetCaptcha = () => {
    recaptchaRef.current?.reset();
    setRecaptchaToken("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA");
      return;
    }

    try {
      setSending(true);

      await api.post("/auth/forgot-password", {
        email,
        recaptchaToken
      });

      // The server deliberately returns the same response whether or not the
      // account exists, so the screen must not reveal anything either.
      setSent(true);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Could not send the reset link. Please try again."
      );
      resetCaptcha();
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <Layout>
        <main className="container-x flex justify-center py-14">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
            <h1 className="text-3xl font-black">
              Check your email
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted">
              If an account exists for <b className="text-ink">{email}</b>, we
              have sent a link to reset your password.
            </p>

            <p className="mt-3 text-sm leading-6 text-muted">
              The link expires in one hour and can only be used once. Remember
              to check your spam folder.
            </p>

            <button
              type="button"
              onClick={() => nav("/login")}
              className="mt-7 w-full rounded-xl bg-ink p-3 font-bold text-white"
            >
              Back to Login
            </button>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="container-x flex justify-center py-14">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-black">
            Forgot Password
          </h1>

          <p className="mt-2 text-sm text-muted">
            Enter the email address on your account and we will send you a link
            to choose a new password.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border p-3"
              placeholder="Email"
            />

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={(token) => setRecaptchaToken(token || "")}
              onExpired={() => setRecaptchaToken("")}
            />

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-xl bg-ink p-3 font-bold text-white disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Remembered it?{" "}
            <button
              type="button"
              onClick={() => nav("/login")}
              className="font-bold text-gold"
            >
              Back to Login
            </button>
          </p>
        </div>
      </main>
    </Layout>
  );
}

export default ForgotPassword;