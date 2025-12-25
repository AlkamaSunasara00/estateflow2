const express = require("express");
const router = express.Router();
const authRoutes = require('../routes/authRoutes/authRoutes');
const users = require("../routes/users/user");
const role = require("../routes/users/role");
const properties = require("../routes/properties/properties");
const buyProperties = require("../routes/buyProperties/buyProperties");
const sellProperties = require("../routes/sellProperties/sellProperties");

const { globalLimiter } = require("../middleware/rateLimiter");

router.use(globalLimiter);
router.use("/", authRoutes);
router.use("/", users);
router.use("/", role);
router.use("/", properties);
router.use("/", buyProperties);
router.use("/", sellProperties);

module.exports = router;