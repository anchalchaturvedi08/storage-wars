const express = require("express");
const { getReports } = require("../controllers/reportController");
const protect = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", protect, authorizeRoles("admin"), getReports);

module.exports = router;