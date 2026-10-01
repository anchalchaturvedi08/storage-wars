import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../component/layout/Layout";
import api from "../../api/axios";

function ResetPassword() {
  const nav = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("The two passwords do not match");
      return;
    }

    try {
      setSaving(true);

      await api.post(`/auth/reset-password/${token}`, {
        password
      });

      setDone(true);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Could not reset the password. The link may have expired."
      );
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <Layout>
        <main className="container-x flex justify-center py-14">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
            <h1 className="text-3xl font-black">
              Password updated
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted">
              Your password has been changed. You can now log in with it.
            </p>

            <button
              type="button"
              onClick={() => nav("/login")}
              className="mt-7 w-full rounded-xl bg-ink p-3 font-bold text-white"
            >
              Go to Login
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
            Set a new password
          </h1>

          <p className="mt-2 text-sm text-muted">
            Choose a new password for your Storage Wars account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border p-3"
              placeholder="New password"
            />

            <input
              required
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border p-3"
              placeholder="Confirm new password"
            />

            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              Show password
            </label>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-ink p-3 font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Reset Password"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Link expired?{" "}
            <button
              type="button"
              onClick={() => nav("/forgot-password")}
              className="font-bold text-gold"
            >
              Request a new one
            </button>
          </p>
        </div>
      </main>
    </Layout>
  );
}

export default ResetPassword;