const express = require("express");

const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

// Get all users - Admin only
router.get(
    "/",
    protect,
    authorizeRoles("admin"),
    getUsers
);

// Get user by ID - Admin only
router.get(
    "/:id",
    protect,
    authorizeRoles("admin"),
    getUserById
);

// Update user - Admin only
router.patch(
    "/:id",
    protect,
    authorizeRoles("admin"),
    updateUser
);

// Delete user - Admin only
router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteUser
);

module.exports = router;