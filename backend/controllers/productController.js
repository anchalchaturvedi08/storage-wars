const Product = require("../models/Product.model");
const cloudinary = require("../config/cloudinary");

// create product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            startingPrice,
            condition,
            brand,
            model,
            collectionDetails
        } = req.body;

        // specifications arrives as a JSON string, because the request is
        // multipart/form-data and FormData cannot carry nested objects.
        let specifications = [];

        if (req.body.specifications) {
            try {
                const parsed = JSON.parse(req.body.specifications);

                if (Array.isArray(parsed)) {
                    specifications = parsed
                        .filter((row) => row && row.label && row.value)
                        .map((row) => ({
                            label: String(row.label).trim(),
                            value: String(row.value).trim()
                        }));
                }
            } catch {
                // Malformed input is ignored rather than failing the whole
                // product creation over an optional field.
                specifications = [];
            }
        }

        const images = [];
        const documents = [];

        // ---- photos ----
        // Normalised to 4:3 at 1200x900 on the way in, so the gallery does not
        // have to compensate for uploads of different shapes. gravity:"auto"
        // lets Cloudinary find the subject rather than blindly centre-cropping.
        const imageFiles = req.files?.images || [];

        for (const file of imageFiles) {
            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                {
                    folder: "storagewars/products",
                    transformation: [
                        {
                            width: 1200,
                            height: 900,
                            crop: "fill",
                            gravity: "auto"
                        },
                        {
                            quality: "auto",
                            fetch_format: "auto"
                        }
                    ]
                }
            );

            images.push(result.secure_url);
        }

        // ---- documents ----
        // resource_type "raw" is how Cloudinary stores anything that is not an
        // image or a video. The original filename is kept so the download has
        // a sensible name rather than a random id.
        const documentFiles = req.files?.documents || [];

        for (const file of documentFiles) {
            const result = await cloudinary.uploader.upload(
                `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                {
                    folder: "storagewars/documents",
                    resource_type: "raw",
                    use_filename: true,
                    unique_filename: true
                }
            );

            documents.push({
                name: file.originalname,
                url: result.secure_url,
                size: file.size
            });
        }

        const product = await Product.create({
            name,
            description,
            category,
            images,
            documents,
            startingPrice,
            condition: condition || "",
            brand: brand || "",
            model: model || "",
            specifications,
            collectionDetails: collectionDetails || "",
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