const express = require("express");
const { createFinance, getFinance } = require("../controllers/finance-controllers");

const router = express.Router()

router.post("/", createFinance);
router.get("/", getFinance);

module.exports = router;