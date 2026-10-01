const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
     {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true
        },

        // Self-reference. null means this is a top-level category;
        // an ObjectId means it is a subcategory of that category.
        //
        // Two levels only: a subcategory cannot itself have children.
        // The controller enforces that, because nothing in the schema
        // can express "parent must have a null parent".
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null
        },

        // Cloudinary URL. Optional - cards fall back to a placeholder.
        image: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            trim: true
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
// The name is no longer globally unique - "Watches" may exist under
// both Electronics and Collectibles. It must be unique WITHIN a parent.
// A compound index expresses that; two top-level categories both have
// parent null, so they still collide correctly.
categorySchema.index({ name: 1, parent: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;