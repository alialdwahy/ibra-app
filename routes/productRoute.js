const express = require("express");

const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct } = require("../controller/productController");
const { get } = require("mongoose");
const { isAdmin, authMiddleware }  = require("../middlewares/authmiddleware");


const router = express.Router();

router.post("/create-product", authMiddleware, isAdmin,  createProduct);
router.get("/getProduct/:id", authMiddleware, getaProduct);
router.put("/editProduct/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/deleteProduct/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/getProduct", authMiddleware, getAllProduct);




module.exports = router;