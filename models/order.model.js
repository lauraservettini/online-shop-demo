const { ObjectId } = require("mongodb");
const db = require("../data/database");

class Order {
  constructor(cart, userData, status = "pending", date, orderId) {
    //status può avere pending, fullfilled, cancelled
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date); 
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString("it-IT", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    if (orderId) {
      this._id = orderId;
    }
  }

  static transformOrderDocument(orderDoc) {
    const order = new Order(
      orderDoc.orderDocument.productData,
      orderDoc.orderDocument.userData,
      orderDoc.orderDocument.status,
      orderDoc.orderDocument.date,
      orderDoc._id
    );
    return order;
  }

  static transformOrderDocuments(orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
  }

  static async findAll() {
    const orders = await db
      .getDb()
      .collection("orders")
      .find()
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findAllForUser(userId) {
    const orders = await db
      .getDb()
      .collection("orders")
      .find({ "orderDocument.userData._id": userId })
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection("orders")
      .findOne({ _id: new ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }
  async save() {
    if (this._id) {
      return db
        .getDb()
        .collection("orders")
        .updateOne({ _id: this._id }, { $set: { "orderDocument.status": this.status } });
    } else {
      const userData = this.userData;
      userData._id = userData._id.toString();
    let productData = this.productData;

        for(let i = 0; i < productData.items.length; i++ ){
            productData.items[i].product._id = productData.items[i].product._id.toString();
      }

      const orderDocument = {
        userData: userData,
        productData: this.productData,
        date: new Date(),
        status: "pending"
      };

      const order = await db
        .getDb()
        .collection("orders")
        .insertOne({ orderDocument });

      return order;
    }
  }
}

module.exports = Order;
