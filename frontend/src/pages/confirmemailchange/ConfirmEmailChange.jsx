import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";

function ConfirmEmailChange() {
  const { token } = useParams();

  const [status, setStatus] = useState("working");
  const [message, setMessage] = useState("Confirming your new email address...");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    const confirm = async () => {
      try {
        const response = await api.get(`/auth/confirm-email-change/${token}`);

        setStatus("done");
        setMessage(response.data.message);
        setNewEmail(response.data.email || "");

        // The stored session still carries the OLD email, and the token was
        // issued against it. Clear it so the user signs in cleanly with the
        // new address.
        localStorage.removeItem("token");
        localStorage.removeItem("user");

      } catch (error) {
        setStatus("failed");
        setMessage(
          error.response?.data?.message ||
          "This link is invalid or has expired."
        );
      }
    };

    confirm();
  }, [token]);

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-soft">

        <h1 className="text-3xl font-black">
          {status === "working" && "Just a moment"}
          {status === "done" && "Email updated"}
          {status === "failed" && "Link not valid"}
        </h1>

        <p className="mt-4 text-sm leading-6 text-muted">
          {message}
        </p>

        {status === "done" && newEmail && (
          <p className="mt-3 rounded-xl bg-cream p-3 text-sm">
            Sign in from now on with <b className="text-ink">{newEmail}</b>
          </p>
        )}

        {status !== "working" && (
          <Link
            to="/login"
            className="mt-7 inline-block rounded-xl bg-ink px-5 py-3 font-bold text-white"
          >
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
}

export default ConfirmEmailChange;