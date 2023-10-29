const Cart = require("../models/cart.model");

function initializeCart(req, res, next) {
    let cart;

    if(!req.session.cart) {
        //all'inizio crea un carrello vuoto
        cart = new Cart();
    } else {
        const sessionCart = req.session.cart;
        //se è già stato creato un carrello riprende i dati nella sessione
        cart = new Cart(
            sessionCart.items,
            sessionCart.totalQuantity,
            sessionCart.totalPrice,
            );
    }
    
    res.locals.cart = cart;
    
    next();
}

module.exports = initializeCart;