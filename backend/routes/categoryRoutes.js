const express = require("express");

const {
    createCategory,getCategories, getCategoryById, updateCategory, deleteCategory
} = require("../controllers/categoryController");

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createCategory
);

router.get(
    "/",
    protect,
    authorizeRoles("admin", "seller", "customer"),
    getCategories
);

router.get(
    "/:id",
    protect,
    authorizeRoles("admin"),
    getCategoryById
);

router.patch(
    "/:id",
    protect,
    authorizeRoles("admin"),
    updateCategory
);

router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteCategory
);

module.exports = router;