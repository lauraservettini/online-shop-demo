const express = require("express");
const adminControllers = require("../controllers/admin.controller");
const imgMulterUploadMid = require("../middleware/img-multer-config");

const router = express.Router();

router.get("/products", adminControllers.getAdminProducts); // /admin/products

router.post("/products", imgMulterUploadMid, adminControllers.createAdminNewProduct); // /admin/products

router.get("/products/new", adminControllers.getAdminNewProduct); // /admin/products/new

router.get("/products/:id", adminControllers.updateProduct); // /admin/products/:id

router.post("/products/:id", imgMulterUploadMid, adminControllers.updateProductSave); // /admin/products/:id

router.delete("/products/:id", adminControllers.deleteProduct); // /admin/products/:id

router.get('/orders', adminControllers.getOrders); // /admin/orders

router.patch('/orders/:id', adminControllers.updateOrder); // /admin/orders/:id

module.exports = router;