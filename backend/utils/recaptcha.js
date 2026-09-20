// Google reCAPTCHA v2 ("I'm not a robot" checkbox) server-side verification.
// The frontend sends the token the checkbox produced; we forward it to Google
// together with our SECRET key, and Google replies with a plain pass/fail.
const verifyRecaptcha = async (token) => {
    if (!token) {
        return { success: false, reason: "missing_token" };
    }

    try {
        const params = new URLSearchParams({
            secret: process.env.RECAPTCHA_SECRET_KEY,
            response: token
        });

        const response = await fetch(
            "https://www.google.com/recaptcha/api/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: params
            }
        );

        const data = await response.json();

        if (!data.success) {
            console.error("RECAPTCHA REJECTED:", data["error-codes"]);
            return { success: false, reason: "google_rejected", errors: data["error-codes"] };
        }

        return { success: true };

    } catch (error) {
        console.error("RECAPTCHA VERIFY ERROR:", error.message);
        return { success: false, reason: "verify_request_failed" };
    }
};

module.exports = { verifyRecaptcha };