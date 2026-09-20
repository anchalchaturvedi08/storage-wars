const Category = require("../models/Category.model");

//create category
const createCategory = async (req,res) => {
    try {
        const { name, description } = req.body;

        const category = await Category.create({
            name, description
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
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

// get all categories
const getCategories = async (req, res) => {
    try {
         const categories = await Category.find();

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

// get single category
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch category",
            error: error.message
        });
    }
};

// update category
// Update Category
const updateCategory = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                status
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

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

// delete category
// Delete Category
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

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
