import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

function VerifyEmail() {
    const { token } = useParams();
    const [message, setMessage] = useState("Verifying your email...");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await api.get(`/auth/verify-email/${token}`);
                setMessage(response.data.message);
                setSuccess(response.data.success);
            } catch (error) {
                setMessage(
                    error.response?.data?.message || "Email verification failed"
                );
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen grid place-items-center">
            <div className="text-center">
                <h1 className="text-4xl font-black">
                    {success ? "Email Verified! ✅" : "Email Verification"}
                </h1>

                <p className="mt-4 text-lg">
                    {message}
                </p>

                {success && (
                    <Link
                        to="/login"
                        className="mt-6 inline-block rounded-xl bg-ink px-5 py-3 font-bold text-white"
                    >
                        Go to Login
                    </Link>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;