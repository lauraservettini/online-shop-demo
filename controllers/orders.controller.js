const stripe = require("stripe")(
  // stripe key di esempio sito stripe
  "'sk_test_9W1R4v0cz6AtC9PVwHFzywti'"
);

// alternativa
// const stripe = require("stripe");
// const stripeObj = stripe('sk_test_9W1R4v0cz6AtC9PVwHFzywti');

const Order = require("../models/order.model");
const User = require("../models/user.models");

const YOUR_DOMAIN = "http://localhost:3000";

async function getOrders(req, res, next) {
  let orders;

  try {
    orders = await Order.findAllForUser(res.locals.uid);
  } catch (error) {
    next(error);
    return;
  }

  res.render("customer/orders/all-orders", {
    orders: orders,
  });
}

let order;
let session;

async function postAddOrder(req, res, next) {
  const cart = res.locals.cart;
  const userId = req.session.uid;

  if (cart.totalQuantity === 0) {
    return;
  }

  let userData;
  try {
    userData = await User.findById(userId);
  } catch (error) {
    return next(error);
  }

  order = new Order(cart, userData);

  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.items.map(function (item) {
        return {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          // price: '{{PRICE_ID}}',// id nel server stripe
          // price_data: {res.locals.cart.totalPrice},
          price_data: {
            currency: "eur",
            product_data: {
              name: item.product.title,
              metadata: {
                item_id: item.product._id,
              },
              description: item.product.description,
            },
            unit_amount: +item.product.price.toFixed(2) * 100,
          },
          quantity: item.quantity,
        };
      }),
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/orders/success`,
      cancel_url: `${YOUR_DOMAIN}/orders/cancel`,
    });

    res.redirect(303, session.url);
  } catch (error) {
    next(error);
    return;
  }
}

async function paymentSuccess(req, res, next) {
  // fa un controllo nel caso sia stata immessa la carta di credito prova (ad. es. 4242 4242 4242 4242)
  if (session.payment_status != "paid") {
    res.redirect("/orders/cancel");
    return;
  }
  try {
    console.log("save e null cart");
    await order.save();
  } catch (error) {
    return next(error);
  }

  req.session.cart = null;

  //per aggiornare subito .badge su cart
  res.locals.cart.totalQuantity = "0";
  res.render("customer/orders/success");
}

function paymentCancel(req, res) {
  res.render("customer/orders/cancel");
}

module.exports = {
  postAddOrder: postAddOrder,
  getOrders: getOrders,
  paymentSuccess: paymentSuccess,
  paymentCancel: paymentCancel,
};
