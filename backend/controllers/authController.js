const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { verifyRecaptcha } = require("../utils/recaptcha");

const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            mobile,
            address,
            city,
            gender,
            role,
            recaptchaToken
        } = req.body;

        const captchaCheck = await verifyRecaptcha(recaptchaToken);

        if (!captchaCheck.success) {
            return res.status(400).json({
                success: false,
                message: "Please complete the reCAPTCHA and try again."
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            mobile,
            address,
            city,
            gender,
            role: role === "seller" ? "seller" : "customer",
            verificationToken
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Base URL comes from the environment so the link works in
        // production. Falls back to the local dev server.
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

        const verificationLink = `${clientUrl}/verify-email/${verificationToken}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your Storage Wars account",
            text: `Hello ${name},\n\nPlease verify your Storage Wars account by clicking this link:\n${verificationLink}\n\nIf you did not create this account, ignore this email.`
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification link"
            });
        }

        user.verificationStatus = 1;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Email verification failed",
            error: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const {
            email,
            password,
            recaptchaToken
        } = req.body;

        const captchaCheck = await verifyRecaptcha(recaptchaToken);

        if (!captchaCheck.success) {
            return res.status(400).json({
                success: false,
                message: "Please complete the reCAPTCHA and try again."
            });
        }

        const user = await User.findOne({ email });

        // A missing user and a wrong password return the SAME status and
        // message. Returning 404 for one and 401 for the other lets an
        // attacker discover which email addresses are registered.
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // The admin block button sets this field. Until now nothing read it,
        // so a blocked user could still log in and use the whole API.
        if (user.status === "blocked") {
            return res.status(403).json({
                success: false,
                message: "This account has been blocked. Please contact support."
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};


// Hash a reset token the same way every time, so the value we look up in the
// database matches the value we derived from the emailed token.
const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const forgotPassword = async (req, res) => {
    try {
        const { email, recaptchaToken } = req.body;

        const captchaCheck = await verifyRecaptcha(recaptchaToken);

        if (!captchaCheck.success) {
            return res.status(400).json({
                success: false,
                message: "Please complete the reCAPTCHA and try again."
            });
        }

        // The SAME response is returned whether or not the account exists.
        // Saying "no account with that email" would rebuild the user
        // enumeration hole we just closed on the login route.
        const genericResponse = {
            success: true,
            message:
                "If an account exists for that email, a reset link has been sent."
        };

        if (!email) {
            return res.status(200).json(genericResponse);
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(200).json(genericResponse);
        }

        // Raw token goes in the email; only its hash is stored.
        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = hashToken(resetToken);
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

        await user.save();

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const resetLink = `${clientUrl}/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Reset your Storage Wars password",
            text: `Hello ${user.name},\n\nWe received a request to reset your Storage Wars password.\n\nOpen this link to choose a new one:\n${resetLink}\n\nThis link expires in one hour and can only be used once.\n\nIf you did not request this, you can ignore this email - your password will not change.`
        });

        res.status(200).json(genericResponse);

    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Could not process the request",
            error: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Look up by the HASH of the supplied token, and require that it has
        // not expired. Both conditions are in the query, so an expired or
        // unknown token simply matches nothing.
        const user = await User.findOne({
            resetPasswordToken: hashToken(token),
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "This reset link is invalid or has expired"
            });
        }

        user.password = await bcrypt.hash(password, 10);

        // Single use: clear both fields so the same link cannot be replayed.
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully. You can now log in."
        });

    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Password reset failed",
            error: error.message
        });
    }
};


// CONFIRM AN EMAIL CHANGE
//
// Public, because the link is opened from an inbox and the person may not be
// logged in. Authenticated by the token itself, exactly like verify-email
// and reset-password.
const confirmEmailChange = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            emailChangeToken: hashToken(token),
            emailChangeExpires: { $gt: new Date() }
        });

        if (!user || !user.pendingEmail) {
            return res.status(400).json({
                success: false,
                message: "This link is invalid or has expired"
            });
        }

        // Re-check uniqueness. Someone else may have registered this address
        // in the hour since the request was made.
        const taken = await User.findOne({
            email: user.pendingEmail,
            _id: { $ne: user._id }
        });

        if (taken) {
            user.pendingEmail = undefined;
            user.emailChangeToken = undefined;
            user.emailChangeExpires = undefined;

            await user.save();

            return res.status(400).json({
                success: false,
                message: "That email has since been registered by another account"
            });
        }

        const previousEmail = user.email;

        user.email = user.pendingEmail;

        // The new address has just proved it receives mail, so it counts as
        // verified. Single use: clear the escrow fields.
        user.verificationStatus = 1;
        user.pendingEmail = undefined;
        user.emailChangeToken = undefined;
        user.emailChangeExpires = undefined;

        await user.save();

        // Tell the old address the change completed, so an unauthorised change
        // is still visible to the original owner.
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: previousEmail,
                subject: "Your Storage Wars email address was changed",
                text: `Hello ${user.name},\n\nThe email address on your Storage Wars account has been changed to ${user.email}.\n\nIf this was not you, contact support immediately - you will no longer be able to sign in with this address.`
            });
        } catch (mailError) {
            // The change itself succeeded; a failed notice must not undo it.
            console.error("EMAIL CHANGE NOTICE FAILED:", mailError.message);
        }

        res.status(200).json({
            success: true,
            message: "Email address updated successfully. Please log in again.",
            email: user.email
        });

    } catch (error) {
        console.error("CONFIRM EMAIL CHANGE ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to confirm email change",
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    confirmEmailChange,
    forgotPassword,
    resetPassword,
    loginUser,
    verifyEmail
};