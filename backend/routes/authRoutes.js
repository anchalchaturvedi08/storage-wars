const express = require("express");
const {
    registerUser,
    loginUser,
    verifyEmail,
    forgotPassword,
    resetPassword,
    confirmEmailChange
} = require("../controllers/authController");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify-email/:token", verifyEmail);

// Public - the user cannot log in, that is the whole point.
// Protected by reCAPTCHA instead, because it sends email.
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Public - opened from an inbox, authenticated by the token.
router.get("/confirm-email-change/:token", confirmEmailChange);

module.exports = router;