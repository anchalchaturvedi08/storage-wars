const express = require("express");

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();


// Create Product → Seller
router.post(
    "/", 
    protect, 
    authorizeRoles("seller"), 
    // upload.fields gives req.files as an object keyed by field name:
    //   req.files.images     -> up to 5 photos
    //   req.files.documents  -> up to 5 PDFs or Word files
    upload.fields([
        { name: "images", maxCount: 5 },
        { name: "documents", maxCount: 5 }
    ]),
    createProduct
);


// Get All Products → Admin, Seller, Customer
router.get(
    "/",
    protect,
    authorizeRoles("admin", "seller", "customer"),
    getProducts
);


// Get Single Product → Admin, Seller, Customer
router.get(
    "/:id",
    protect,
    authorizeRoles("admin", "seller", "customer"),
    getProductById
);


// Update Product → Seller, Admin
router.patch(
    "/:id",
    protect,
    authorizeRoles("seller", "admin"),
    updateProduct
);


// Delete Product → Seller, Admin
router.delete(
    "/:id",
    protect,
    authorizeRoles("seller", "admin"),
    deleteProduct
);


module.exports = router;