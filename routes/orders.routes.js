const express = require("express");
const ordersControllers = require("../controllers/orders.controller");

const router = express.Router();

router.get("/", ordersControllers.getOrders); // /orders

router.post("/", ordersControllers.postAddOrder);  // /orders

router.get("/success",ordersControllers.paymentSuccess); // /orders/sussess

router.get("/cancel", ordersControllers.paymentCancel); // /orders/cancel

module.exports = router;