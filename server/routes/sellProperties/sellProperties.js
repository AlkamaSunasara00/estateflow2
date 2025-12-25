const express = require("express");
const router = express.Router();
const sellProperties = require("../../controller/sellProperties/sellProperties");

router.post("/sell-properties", sellProperties.sellProperty);

module.exports = router;