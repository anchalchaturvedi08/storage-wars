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

        const verificationLink = `http://localhost:5173/verify-email/${verificationToken}`;

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

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
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

module.exports = {
    registerUser,
    loginUser,
    verifyEmail
};
