const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
    {
         name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true
        },

        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"]
        },

        images: {
            type: [String],
            default: []
        },

        startingPrice: {
            type: Number,
            required: [true, "Starting price is required"],
            min: 0
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Seller is required"]
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);
const Product = mongoose.model("Product", productSchema);

module.exports = Product;

// Yahan humne do references use kiye:
// category → Category
// seller   → User
// Matlab Product ke andar hum poora Category ya User object store nahi karenge. Unka MongoDB _id reference ke roop mein rakhenge.