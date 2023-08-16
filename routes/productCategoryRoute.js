const express = require("express");
const { createProductCategory, updateProductCategory } = require("../controller/productCategoryController");
const {authMiddleware} = require("../middlewares/authmiddleware")
const router = express.Router();


router.post("/create-productCategory", authMiddleware, createProductCategory),
router.put("/update-productCategory/:id", authMiddleware, updateProductCategory)


module.exports = router;