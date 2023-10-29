const db = require("../data/database");
const { ObjectId } = require("mongodb");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image;
    this.imagaPath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
    if (productData._id) {
      this._id = productData._id.toString(); //non lavora con on ObjectId ma con la stringa associata
    }
  }

  static async findMultiple(ids) {
    const productIds = ids.map(function(id) {
      return new ObjectId(id);
    })
    
    const products = await db
      .getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }
  static async findById(id) {
    let prodId;
    try {
      prodId = new ObjectId(id);
    } catch (error) {
      error.code = 404; //aggiunge dati all'oggetto Error
      throw error;
    }

    const product = await db
      .getDb()
      .collection("products")
      .findOne({ _id: prodId });

    if (!product) {
      const error = new Error("Could not find product with provided id!");
      error.code = 404; //aggiunge dati all'oggetto Error
      throw error;
    }

    return product;
  }
  static async findAll() {
    const products = await db.getDb().collection("products").find().toArray();

    //ritorna un nuovo valore al posto del valore iniziale
    //return products.map((productDocument) => new Product(productDocument));
    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }
  async save() {
    let product; 
    let isAlreadyStored;
    let prodId;
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image, // salva solo il nome del file nel database
    };

    if (this._id) {
      prodId = new ObjectId(this._id);

      isAlreadyStored = await db
      .getDb()
      .collection("products")
      .findOne({ _id: prodId });
    }
    if (isAlreadyStored) {
      if(!this.image){
        delete productData.image;
      }
      await db
        .getDb()
        .collection("products")
        .updateOne({ _id: prodId },{ $set: productData});
    } else {
      product = await db.getDb().collection("products").insertOne(productData); 
    }
    console.log("new product r 95");
    console.dir(product);
  }

  replaceImg(newImg) {
    if(!newImg){
      this.image = newImg;
    }
    this.imagaPath = `product-data/images/${this.image}`;
    this.imageUrl = `/products/assets/images/${this.image}`;
  }

  async delProduct() {
    console.dir(this);
    let prodId;
    if(this._id){
      prodId = new ObjectId(this._id);
      await db.getDb().collection("products").deleteOne({_id: prodId});
    }
    return;
  }
}

module.exports = Product;
