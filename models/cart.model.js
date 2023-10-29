const Product = require("../models/product.model");
const { ObjectId } = require("mongodb");

class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) {
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  async updatePrices() {
    const productIds = this.items.map(function (item) {
      return item.product._id;
    });

    const products = await Product.findMultiple(productIds);
    const deletableCartItemProductIds = [];

    const cartItems = this.items;

    for (let i = 0; i < this.items.length; i++) {
      const product = products.find(function (prod) {
        const productId = prod._id;

        const cartItemId = cartItems[i].product._id.toString();

        return productId == cartItemId;
      });

      if (!product) {
        // product was deleted!
        // "schedule" for removal from cart
        deletableCartItemProductIds.push(this.items[i].product._id);
        continue;
      }

      // product was not deleted
      // set product data and total price to latest price from database
      this.items[i].product = product;
      this.items[i].totalPrice =
        this.items[i].quantity * this.items[i].product.price;
    }

    if (deletableCartItemProductIds.length > 0) {
      this.items = this.items.filter(function (item) {
        return deletableCartItemProductIds.indexOf(item.product._id) < 0;
      });
    }

    // re-calculate cart totals
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const item of this.items) {
      this.totalQuantity = this.totalQuantity + item.quantity;
      this.totalPrice = this.totalPrice + item.totalPrice;
    }
  }

  addItem(product) {
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price,
    };
    const productId = product._id.toString();
    
    //salvare i dati del carrello nella sessione
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      const itemId = item.product._id.toString();
      if (itemId === productId) {
        this.items[i].quantity = item.quantity + 1;
        this.items[i].totalPrice = item.totalPrice + product.price;

        this.totalQuantity++;
        this.totalPrice += product.price;
        return;
      }
    }
    this.items.push(cartItem);
    this.totalQuantity++;
    this.totalPrice += product.price;
  }

  cartProductUpdate(productId, newQuantity) {
    const prodId = productId.toString();
    let totalPrice;
    let totalQuantity;
    let itemUpdated;
    if (newQuantity > 0) {
      totalPrice = 0;
      totalQuantity = 0;
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        const itemId = item.product._id.toString();

        if (itemId === prodId) {
          this.items[i].quantity = newQuantity;
          this.items[i].totalPrice = item.product.price * newQuantity;
          totalQuantity += newQuantity;
          totalPrice += item.product.price * newQuantity;

          itemUpdated = this.items[i];
        } else {
          totalQuantity += item.quantity;
          totalPrice += item.totalPrice;
        }
      }
    } else {
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        const itemId = item.product._id.toString();
        totalQuantity = this.totalQuantity;
        totalPrice = this.totalPrice;

        if (itemId === prodId) {
          totalQuantity -= item.product.quantity;
          totalPrice -= item.product.price;
          this.items.splice(i, 1);
        }
      }
    }

    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;

    return itemUpdated;
  }
}

module.exports = Cart;
