const express = require("express");
const { createProductCategory, updateProductCategory, deleteProductCategory, getProductCategory, getAllProductCategory } = require("../controller/productCategoryController");
const {authMiddleware} = require("../middlewares/authmiddleware")
const router = express.Router();


router.post("/create-productCategory", authMiddleware, createProductCategory);
router.put("/update-productCategory/:id", authMiddleware, updateProductCategory);
router.delete("/delete-productCategory/:id", authMiddleware, deleteProductCategory);
router.get("/get-productCategory/:id", authMiddleware, getProductCategory);
router.get("/getall-productCategory",  getAllProductCategory);


module.exports = router;