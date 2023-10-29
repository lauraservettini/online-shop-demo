const db = require("../data/database");
const authController = require("../controllers/auth.controller");

const express = require("express");

const router = express.Router();

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.logout);

module.exports = router;