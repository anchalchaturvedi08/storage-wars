const Category = require("../models/Category.model");
const Product = require("../models/Product.model");
const cloudinary = require("../config/cloudinary");

// Upload a buffer to Cloudinary. multer uses memoryStorage, so the file
// never touches this server's disk - it goes straight through.
const uploadImage = (buffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "storagewars/categories",

                // Normalise every upload to one shape on the way in, so the
                // frontend never has to compensate for inconsistent images.
                //
                //   width/height + crop:"fill"  forces 4:3 at 800x600
                //   gravity:"auto"              Cloudinary finds the subject
                //                               and crops around it, rather
                //                               than blindly taking the centre
                //   quality/fetch_format "auto" serves the smallest format the
                //                               requesting browser supports
                transformation: [
                    {
                        width: 800,
                        height: 600,
                        crop: "fill",
                        gravity: "auto"
                    },
                    {
                        quality: "auto",
                        fetch_format: "auto"
                    }
                ]
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );

        stream.end(buffer);
    });


// CREATE CATEGORY OR SUBCATEGORY
const createCategory = async (req, res) => {
    try {
        const { name, description, parent } = req.body;

        // An empty string arrives from a form whose "no parent" option has
        // an empty value. Normalise it to null so the schema default applies.
        const parentId = parent && parent !== "" ? parent : null;

        if (parentId) {
            const parentCategory = await Category.findById(parentId);

            if (!parentCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Parent category not found"
                });
            }

            // Two levels only. Without this, a subcategory could be given a
            // subcategory and the tree would grow arbitrarily deep - which
            // the UI and the product filter are not built for.
            if (parentCategory.parent) {
                return res.status(400).json({
                    success: false,
                    message:
                        "A subcategory cannot be nested under another subcategory"
                });
            }
        }

        // Same name under the same parent is a duplicate; the same name under
        // a different parent is fine.
        const duplicate = await Category.findOne({
            name: name.trim(),
            parent: parentId
        });

        if (duplicate) {
            return res.status(400).json({
                success: false,
                message: parentId
                    ? "That subcategory already exists under this category"
                    : "That category already exists"
            });
        }

        let image = "";

        if (req.file) {
            image = await uploadImage(req.file.buffer);
        }

        const category = await Category.create({
            name,
            description,
            parent: parentId,
            image
        });

        res.status(201).json({
            success: true,
            message: parentId
                ? "Subcategory created successfully"
                : "Category created successfully",
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Category creation failed",
            error: error.message
        });
    }
};


// GET CATEGORIES
//
// ?tree=true      nested - each top-level category carries its children
// ?parent=<id>    only the children of that category
// ?topLevel=true  only categories with no parent
// (none)          everything, flat - keeps older callers working
const getCategories = async (req, res) => {
    try {
        const { tree, parent, topLevel } = req.query;

        if (tree === "true") {
            const all = await Category.find().sort({ name: 1 }).lean();

            const roots = all.filter((c) => !c.parent);

            const nested = roots.map((root) => ({
                ...root,
                children: all.filter(
                    (c) => c.parent && String(c.parent) === String(root._id)
                )
            }));

            return res.status(200).json({
                success: true,
                message: "Categories fetched successfully",
                categories: nested
            });
        }

        const filter = {};

        if (parent) {
            filter.parent = parent;
        } else if (topLevel === "true") {
            filter.parent = null;
        }

        const categories = await Category.find(filter)
            .populate("parent", "name")
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message
        });
    }
};


// GET SINGLE CATEGORY, WITH ITS CHILDREN
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate("parent", "name");

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const children = await Category.find({ parent: category._id })
            .sort({ name: 1 });

        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            category,
            children
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch category",
            error: error.message
        });
    }
};


// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { name, description, status, parent } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (parent !== undefined) {
            const parentId = parent && parent !== "" ? parent : null;

            // A category cannot be its own parent. With deeper nesting this
            // would need a full ancestor walk; at two levels the direct
            // check plus the rules below are sufficient.
            if (parentId && String(parentId) === String(category._id)) {
                return res.status(400).json({
                    success: false,
                    message: "A category cannot be its own parent"
                });
            }

            if (parentId) {
                const parentCategory = await Category.findById(parentId);

                if (!parentCategory) {
                    return res.status(404).json({
                        success: false,
                        message: "Parent category not found"
                    });
                }

                if (parentCategory.parent) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "A subcategory cannot be nested under another subcategory"
                    });
                }

                // Moving a category that has children would push those
                // children to a third level.
                const childCount = await Category.countDocuments({
                    parent: category._id
                });

                if (childCount > 0) {
                    return res.status(400).json({
                        success: false,
                        message:
                            "This category has subcategories, so it cannot become one"
                    });
                }
            }

            category.parent = parentId;
        }

        if (name !== undefined) category.name = name;
        if (description !== undefined) category.description = description;
        if (status !== undefined) category.status = status;

        if (req.file) {
            category.image = await uploadImage(req.file.buffer);
        }

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Category update failed",
            error: error.message
        });
    }
};


// DELETE CATEGORY
//
// Refuses while anything still points at it. Deleting silently would leave
// products and subcategories referencing a document that no longer exists.
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const childCount = await Category.countDocuments({
            parent: category._id
        });

        if (childCount > 0) {
            return res.status(400).json({
                success: false,
                message: `This category has ${childCount} subcategor${
                    childCount === 1 ? "y" : "ies"
                }. Delete or move them first.`
            });
        }

        const productCount = await Product.countDocuments({
            category: category._id
        });

        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `This category is used by ${productCount} product${
                    productCount === 1 ? "" : "s"
                }. Reassign them first.`
            });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Category deletion failed",
            error: error.message
        });
    }
};


module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};