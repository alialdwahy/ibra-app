const express = require("express");

const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating, uploadImages, deleteImages } = require("../controller/productController");
const { get } = require("mongoose");
const { isAdmin, authMiddleware }  = require("../middlewares/authmiddleware");
const { uploadPhoto, productImageResize } = require("../middlewares/uploadImages");


const router = express.Router();

router.post("/create-product", authMiddleware, isAdmin,  createProduct);
router.get("/getProduct/:id", authMiddleware, getaProduct);
router.put("/upload", authMiddleware, isAdmin, uploadPhoto.array('images',10),productImageResize,uploadImages);
router.put("/editProduct/:id", authMiddleware, isAdmin, updateProduct);
router.put("/add-wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.delete("/deleteProduct/:id", authMiddleware, isAdmin, deleteProduct);
router.delete("/delete-image/:id", authMiddleware, isAdmin, deleteImages);
router.get("/getProduct",  getAllProduct);




module.exports = router;