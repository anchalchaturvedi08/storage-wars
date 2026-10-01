/* ==========================================================
   public/config.js  —  THE SETTER

   Served as a plain file, NOT compiled into the bundle.
   index.html loads it before the bundle, so these values are
   available at runtime and can be edited on the server without
   rebuilding.

   LOCAL: leave the keys blank and they fall through to .env.
   LIVE:  they must hold real values, because .env is not
          deployed and Vite bakes env vars in at build time.

   Everything here is PUBLIC. Never put a secret key in it.
   ========================================================== */

window.__APP_CONFIG__ = {
    // Local: full URL, because frontend and backend are separate servers.
    // Live:  "/api", because they share one domain.
    API_URL: "http://localhost:5000/api",

    // Blank locally so .env wins. Real values required on the server.
    RAZORPAY_KEY_ID: "",
    RECAPTCHA_SITE_KEY: ""
};