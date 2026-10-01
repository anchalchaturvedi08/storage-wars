const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        },
        mobile: {
            type: String,
            required: [true, "Mobile is required"],
            trim: true
        },
        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true
        },
        gender: {
            type: String,
            required: [true, "Gender is required"]
        },
        role: {
            type: String,
            enum: ["admin", "seller", "customer"],
            default: "customer"
        },
        status: {
            type: String,
            enum: ["active", "blocked"],
            default: "active"
        },
        verificationStatus: {
            type: Number,
            enum: [0, 1],
            default: 0
        },
        verificationToken: {
            type: String
        },
        // Password reset.
        // We store a SHA-256 HASH of the token, never the token itself. The
        // raw value only ever exists in the email we send. If this collection
        // leaked, the stored hashes would be useless to an attacker - the same
        // reasoning as hashing passwords.
        resetPasswordToken: {
            type: String
        },
        // Reset links expire after one hour. A link sitting in an inbox for
        // months is a standing key to the account.
        resetPasswordExpires: {
            type: Date
        },
        // Email change, held in escrow.
        //
        // A new address is NEVER written straight to `email`. It waits here
        // until the owner of the NEW inbox clicks the confirmation link.
        // Until then the account still belongs to the original address, so a
        // stolen session cannot complete a takeover: the attacker would also
        // need access to the mailbox they nominated.
        pendingEmail: {
            type: String,
            lowercase: true,
            trim: true
        },
        // SHA-256 hash of the token, never the token itself.
        emailChangeToken: {
            type: String
        },
        emailChangeExpires: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;