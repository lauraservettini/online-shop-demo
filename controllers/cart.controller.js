const Product = require("../models/product.model");

function getCart(req, res) {
    res.render("customer/cart/cart");
}

async function addCartItem(req, res, next) {
    let product;
    
    try {
        product = await Product.findById(req.body.productId);
    } catch (error) {
        return next(error);
    }
    
    const cart = res.locals.cart;
    cart.addItem(product);

    //sostituisce il carrello aggiornato nella sessione
    req.session.cart = cart;

    //201 sussessfully added data
    res.status(201).json({
        message: "Item added to the cart!",
        totalCartItems: cart.totalQuantity,
    });
}

function updateCart (req, res) {
    const cart = res.locals.cart;
    const prodId = req.body.productId;
    const quantity = +req.body.quantity;

    const itemUpdated = cart.cartProductUpdate(prodId, quantity);

    req.session.cart = cart;
    
    res.status(201).json({
        message: "Item updated!",
        newTotalCartQuantity: cart.totalQuantity,
        newTotalCartPrice: cart.totalPrice,
        itemUpdated: itemUpdated
    });
}

module.exports = {
    addCartItem: addCartItem,
    getCart: getCart,
    updateCart: updateCart
};