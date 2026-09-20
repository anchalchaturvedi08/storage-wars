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
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;