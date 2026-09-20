const User = require("../models/User.model");


// GET ALL USERS
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};


// GET USER BY ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch user",
            error: error.message
        });
    }
};


// UPDATE USER
const updateUser = async (req, res) => {
    try {
        const {
            name,
            mobile,
            address,
            city,
            gender,
            status
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                mobile,
                address,
                city,
                gender,
                status
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error.message
        });
    }
};


// DELETE USER
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message
        });
    }
};


module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};