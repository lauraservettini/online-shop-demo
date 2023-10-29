const express = require("express");
const productsControllers = require("../controllers/products.controller");

const router = express.Router();

router.get("/", productsControllers.getProducts); // /products

router.get("/:id", productsControllers.getProductById); // /products/:id


module.exports = router;