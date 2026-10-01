const express = require("express");

const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getMyProfile,
    updateMyProfile,
    changeMyPassword,
    requestEmailChange,
    cancelEmailChange
} = require("../controllers/userController");

const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

// ---------------------------------------------------------------
// SELF-SERVICE - any logged in user, scoped to their own account.
//
// These MUST be declared before "/:id". Express matches in declaration
// order, so if "/:id" came first a request to /api/users/me would match
// it with id = "me", and findById("me") throws a CastError.
// Same reason /bids/my is declared before /bids/:auctionId.
// ---------------------------------------------------------------

router.get("/me", protect, getMyProfile);

router.patch("/me", protect, updateMyProfile);

router.patch("/me/password", protect, changeMyPassword);

router.patch("/me/email", protect, requestEmailChange);

router.delete("/me/email", protect, cancelEmailChange);


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