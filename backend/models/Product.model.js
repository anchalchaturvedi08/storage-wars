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

        // Supporting paperwork - RC book, service history, invoices.
        // Stored as Cloudinary "raw" uploads, which is how non-image files
        // are held. Public by design: a bidder needs the documents BEFORE
        // bidding, not after winning, or they are bidding blind.
        documents: {
            type: [
                {
                    name: { type: String, required: true },
                    url: { type: String, required: true },
                    size: { type: Number }
                }
            ],
            default: []
        },

        // ---- optional descriptive fields ----
        // All optional, so every product created before this existed stays
        // valid. The detail page renders each block only when it has content.

        condition: {
            type: String,
            enum: ["new", "like-new", "good", "fair", "for-parts", ""],
            default: ""
        },

        brand: {
            type: String,
            trim: true,
            default: ""
        },

        model: {
            type: String,
            trim: true,
            default: ""
        },

        // Free-form label/value pairs rather than fixed columns, so a
        // motorcycle can list engine capacity and a laptop can list RAM
        // without either needing its own schema.
        specifications: {
            type: [
                {
                    label: { type: String, required: true, trim: true },
                    value: { type: String, required: true, trim: true }
                }
            ],
            default: []
        },

        // How the winner takes delivery - pickup address, shipping terms,
        // collection deadline.
        collectionDetails: {
            type: String,
            trim: true,
            default: ""
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