import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Layout from "../../component/layout/Layout";
import api from "../../api/axios";

function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    city: "",
    gender: "",
    role: "customer"
  });

  const [recaptchaToken, setRecaptchaToken] = useState("");
  const recaptchaRef = useRef(null);

  const resetCaptcha = () => {
    recaptchaRef.current?.reset();
    setRecaptchaToken("");
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      alert("Please complete the reCAPTCHA");
      return;
    }

    try {
      await api.post("/auth/register", {
        ...form,
        recaptchaToken
      });

      alert("Account created successfully!");
      nav("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Registration failed"
      );
      resetCaptcha();
    }
  };

  return (
    <Layout>
      <main className="container-x flex justify-center py-14">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-black">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-muted">
            Join Storage Wars
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4"
          >
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              className="w-full rounded-xl border p-3"
              placeholder="Full Name"
            />

            <input
              required
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              className="w-full rounded-xl border p-3"
              placeholder="Email"
            />

            <input
              required
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              className="w-full rounded-xl border p-3"
              placeholder="Password"
            />

            <input
              required
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              type="text"
              className="w-full rounded-xl border p-3"
              placeholder="Mobile"
            />

            <input
              required
              name="address"
              value={form.address}
              onChange={handleChange}
              type="text"
              className="w-full rounded-xl border p-3"
              placeholder="Address"
            />

            <input
              required
              name="city"
              value={form.city}
              onChange={handleChange}
              type="text"
              className="w-full rounded-xl border p-3"
              placeholder="City"
            />

            <select
              required
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-xl border p-3"
            >
              <option value="customer">
                Register as Customer
              </option>
              <option value="seller">
                Register as Seller
              </option>
            </select>

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(token) => setRecaptchaToken(token || "")}
              onExpired={() => setRecaptchaToken("")}
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-ink p-3 font-bold text-white"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <button
              onClick={() => nav("/login")}
              className="font-bold text-gold"
            >
              Login
            </button>
          </p>
        </div>
      </main>
    </Layout>
  );
}

export default Register;