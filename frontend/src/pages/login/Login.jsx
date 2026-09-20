import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Layout from "../../component/layout/Layout";
import api from "../../api/axios";
import "./Login.css";

function Login() {
  let nav = useNavigate(),
    [e, setE] = useState(""),
    [p, setP] = useState(""),
    [recaptchaToken, setRecaptchaToken] = useState("");

  const recaptchaRef = useRef(null);

  // A v2 token is single-use: after any submit attempt the widget must be
  // reset so the user gets a fresh checkbox instead of a stale token.
  const resetCaptcha = () => {
    recaptchaRef.current?.reset();
    setRecaptchaToken("");
  };

  return (
    <Layout>
      <main className="container-x flex justify-center py-14">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
          <h1 className="text-3xl font-black">
            Login
          </h1>

          <p className="mt-2 text-sm text-muted">
            Login to your Storage Wars account.
          </p>

          <form
            onSubmit={async (x) => {
              x.preventDefault();

              if (!recaptchaToken) {
                alert("Please complete the reCAPTCHA");
                return;
              }

              try {
                const response = await api.post("/auth/login", {
                  email: e,
                  password: p,
                  recaptchaToken
                });

                const { token, user } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem(
                  "user",
                  JSON.stringify(user)
                );

                if (user.role === "admin") {
                  nav("/admin");
                } else if (user.role === "seller") {
                  nav("/seller");
                } else {
                  nav("/buyer");
                }

              } catch (error) {
                alert(
                  error.response?.data?.message ||
                  "Login failed"
                );
                resetCaptcha();
              }
            }}
            className="mt-6 space-y-4"
          >
            <input
              required
              value={e}
              onChange={(x) => setE(x.target.value)}
              type="email"
              className="w-full rounded-xl border p-3"
              placeholder="Email"
            />

            <input
              required
              value={p}
              onChange={(x) => setP(x.target.value)}
              type="password"
              className="w-full rounded-xl border p-3"
              placeholder="Password"
            />

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
              Login
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => nav("/register")}
              className="font-bold text-gold"
            >
              Register
            </button>
          </p>
        </div>
      </main>
    </Layout>
  );
}

export default Login;