const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


// GET ALL USERS
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};


// GET USER BY ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user",
            error: error.message
        });
    }
};


// UPDATE USER
const updateUser = async (req, res) => {
    try {
        const {
            name,
            mobile,
            address,
            city,
            gender,
            status
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                mobile,
                address,
                city,
                gender,
                status
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error.message
        });
    }
};


// DELETE USER
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message
        });
    }
};



// ---------------------------------------------------------------
// SELF-SERVICE ENDPOINTS
//
// Everything above is admin-only and takes an id from the URL.
// These take the id from the VERIFIED TOKEN instead, so there is no
// parameter a user could change to reach someone else's account.
// ---------------------------------------------------------------

// GET MY PROFILE
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};


// UPDATE MY PROFILE
const updateMyProfile = async (req, res) => {
    try {
        const { name, mobile, address, city, gender } = req.body;

        // Only these five fields are read from the body. Email, role and
        // status are deliberately NOT here - assigning req.body wholesale
        // would let a customer promote themselves to admin.
        const updates = {};

        if (name !== undefined) updates.name = name;
        if (mobile !== undefined) updates.mobile = mobile;
        if (address !== undefined) updates.address = address;
        if (city !== undefined) updates.city = city;
        if (gender !== undefined) updates.gender = gender;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        });
    }
};


// CHANGE MY PASSWORD
const changeMyPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current and new password are both required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            });
        }

        // The password field is excluded from other queries, so it has to be
        // fetched explicitly here.
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Requiring the current password matters: a stolen session token
        // alone should not be enough to lock the real owner out.
        const isCurrentCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isCurrentCorrect) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to change password",
            error: error.message
        });
    }
};


const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");


// REQUEST AN EMAIL CHANGE
//
// This does NOT change the email. It parks the new address in pendingEmail
// and sends a confirmation link to it. See User.model.js for why.
const requestEmailChange = async (req, res) => {
    try {
        const { newEmail, currentPassword } = req.body;

        if (!newEmail || !currentPassword) {
            return res.status(400).json({
                success: false,
                message: "New email and current password are both required"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // The current password is required even though the caller is already
        // authenticated. A stolen token alone must not be enough to start
        // moving the account to another mailbox.
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const normalised = String(newEmail).toLowerCase().trim();

        if (normalised === user.email) {
            return res.status(400).json({
                success: false,
                message: "That is already your email address"
            });
        }

        const taken = await User.findOne({ email: normalised });

        if (taken) {
            return res.status(400).json({
                success: false,
                message: "That email is already registered"
            });
        }

        const changeToken = crypto.randomBytes(32).toString("hex");

        user.pendingEmail = normalised;
        user.emailChangeToken = hashToken(changeToken);
        user.emailChangeExpires = new Date(Date.now() + 60 * 60 * 1000);

        await user.save();

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const confirmLink = `${clientUrl}/confirm-email-change/${changeToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 1. Confirmation goes to the NEW address - only its owner can finish.
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: normalised,
            subject: "Confirm your new Storage Wars email address",
            text: `Hello ${user.name},\n\nA request was made to change the email address on your Storage Wars account to this one.\n\nConfirm it by opening this link:\n${confirmLink}\n\nThis link expires in one hour. Until you confirm, your account keeps using its current email address.\n\nIf you did not request this, ignore this email.`
        });

        // 2. Warning goes to the OLD address, so the real owner finds out
        //    even if someone else started this.
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Someone requested an email change on your account",
            text: `Hello ${user.name},\n\nA request was made to change your Storage Wars email address to ${normalised}.\n\nYour account has NOT changed yet - it still uses this address.\n\nIf this was you, check the new inbox for a confirmation link.\n\nIf this was NOT you, log in and change your password immediately, then cancel the request from your profile page.`
        });

        res.status(200).json({
            success: true,
            message: `A confirmation link has been sent to ${normalised}. Your email will not change until you open it.`,
            pendingEmail: normalised
        });

    } catch (error) {
        console.error("EMAIL CHANGE REQUEST ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to request email change",
            error: error.message
        });
    }
};


// CANCEL A PENDING EMAIL CHANGE
const cancelEmailChange = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.pendingEmail = undefined;
        user.emailChangeToken = undefined;
        user.emailChangeExpires = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email change request cancelled"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to cancel email change",
            error: error.message
        });
    }
};

module.exports = {
    getMyProfile,
    requestEmailChange,
    cancelEmailChange,
    updateMyProfile,
    changeMyPassword,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};