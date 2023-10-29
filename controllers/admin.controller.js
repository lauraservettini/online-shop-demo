const Product = require("../models/product.model");
const Order = require("../models/order.model");

async function getAdminProducts(req, res, next) {
  let products;
  try {
    products = await Product.findAll();
  } catch (error) {
    next(error);
    return;
  }
  res.render("admin/products/all-products", { products: products });
}

function getAdminNewProduct(req, res) {
  const product = {
    title: "",
    summary: "",
    price: "",
    description: "",
  };
  res.render("admin/products/new-product", { product: product });
}

async function createAdminNewProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products");
}

async function updateProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
  } catch (error) {
    next(error);
    return;
  }
  res.render("admin/products/update-product", { product: product });
}

async function updateProductSave(req, res, next) {
    const product = new Product({
        _id: req.params.id,
        ...req.body
    });

    if(req.file){
        product.replaceImg(req.file.filename);
    }

    try {
        await product.save();
    } catch (error) {
        next(error);
        return
    }
    res.redirect("/admin/products");
}

async function deleteProduct(req, res, next) {
    let product;
    try {
        const productData = await Product.findById(req.params.id);

        product = new Product ({
            ...productData
        })

        await product.delProduct();
    } catch (error) {
        next(error);
        return
    }

    res.json({ message: "deleted product"});
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    
    res.render('admin/orders/all-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ message: 'Order updated', newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAdminProducts: getAdminProducts,
  getAdminNewProduct: getAdminNewProduct,
  createAdminNewProduct: createAdminNewProduct,
  updateProduct: updateProduct,
  updateProductSave: updateProductSave,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder
};
