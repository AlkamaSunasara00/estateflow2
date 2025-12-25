const express = require("express");
const router = express.Router();
const buyProperties = require("../../controller/buyProperties/buyProperties");

router.post("/buy-properties", buyProperties.buyProperty);

module.exports = router;