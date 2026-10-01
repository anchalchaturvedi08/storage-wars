/* ==========================================================
   src/config.js  —  THE READER

   Compiled into the bundle. Reads window.__APP_CONFIG__ if
   public/config.js has set it, otherwise falls back to Vite
   environment variables from .env.

   Do NOT confuse this with public/config.js, which SETS that
   global and is served as a plain file.
   ========================================================== */

const runtime =
    typeof window !== "undefined" && window.__APP_CONFIG__
        ? window.__APP_CONFIG__
        : {};

export const API_URL =
    runtime.API_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";

export const RAZORPAY_KEY_ID =
    runtime.RAZORPAY_KEY_ID ||
    import.meta.env.VITE_RAZORPAY_KEY_ID ||
    "";

export const RECAPTCHA_SITE_KEY =
    runtime.RECAPTCHA_SITE_KEY ||
    import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
    "";