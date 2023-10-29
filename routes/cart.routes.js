const express = require("express");
const cartControllers = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", cartControllers.getCart); // /cart/

router.post("/items", cartControllers.addCartItem); // /cart/items

router.patch("/items", cartControllers.updateCart); // /cart/items 

module.exports = router;