const Product = require("../models/Product.model");
const cloudinary = require("../config/cloudinary");

// create product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            startingPrice
        } = req.body;

        let imageUrl = "";

        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
                {
                    folder: "storagewars/products"
                }
            );

            imageUrl = uploadResult.secure_url;
        }

        const product = await Product.create({
            name,
            description,
            category,
            images: imageUrl ? [imageUrl] : [],
            startingPrice,
            seller: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("CREATE PRODUCT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Product creation failed",
            error: error.message
        });
    }
};

// get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("category", "name")
            .populate("seller", "name email");

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        });

    } catch (error) {
        console.error(
            "GET PRODUCTS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
};

// get single product
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(
            req.params.id
        )
            .populate("category", "name")
            .populate("seller", "name email");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product
        });

    } catch (error) {
        console.error(
            "GET PRODUCT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: error.message
        });
    }
};

// update product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (
            req.user.role === "seller" &&
            String(product.seller) !== String(req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own products"
            });
        }

        Object.assign(product, req.body);

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error("UPDATE PRODUCT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Product update failed",
            error: error.message
        });
    }
};

// delete product
const deleteProduct = async (req, res) => {
    try {
        // Find product first
        const product = await Product.findById(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Seller can delete only own product
        if (
            req.user.role === "seller" &&
            String(product.seller) !==
                String(req.user.id)
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only delete your own products"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error(
            "DELETE PRODUCT ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Product deletion failed",
            error: error.message
        });
    }
};

// exports
module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};