const Contact = require("../models/Contact.model");
const nodemailer = require("nodemailer");
const { verifyRecaptcha } = require("../utils/recaptcha");

const createContact = async (req, res) => {
    try {
        const { name, email, message, recaptchaToken } = req.body;

        const captchaCheck = await verifyRecaptcha(recaptchaToken);

        if (!captchaCheck.success) {
            return res.status(400).json({
                success: false,
                message: "Please complete the reCAPTCHA and try again."
            });
        }

        const contact = await Contact.create({
            name,
            email,
            message
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `Storage Wars Contact Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        });

        res.status(201).json({
            success: true,
            message: "Message submitted successfully",
            contact
        });

    } catch (error) {
        console.error("CONTACT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Message submission failed",
            error: error.message
        });
    }
};

module.exports = {
    createContact
};
