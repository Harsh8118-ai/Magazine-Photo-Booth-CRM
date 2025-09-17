const express = require("express")
const { createOrder, getOrders } = require("../controllers/orders-controllers")

const router = express.Router()

router.post("/", createOrder);
router.get("/", getOrders);

module.exports = router;