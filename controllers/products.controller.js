const Product = require("../models/product.model");

async function getProducts (req , res, next){
    let products;
    try {
        products = await Product.findAll();
    } catch (error) {
        return next(error);
    }
    res.render("customer/products/all-products", {products: products});
}

async function getProductById(req,res, next) {
    let productById;
    let product;
    try {
        productById = await Product.findById(req.params.id);
        product = new Product(productById);
    } catch (error) {
        return next(error);
    }
    res.render("customer/products/product-details", {product: product});
}

module.exports = {
    getProducts: getProducts,
    getProductById: getProductById,
}