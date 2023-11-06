const express = require("express");
const {authMiddleware} = require("../middlewares/authmiddleware");
const { createBrand, updateBrand, deleteBrand, getBrand, getAllBrand } = require("../controller/brandController");
const router = express.Router();


router.post("/create-brand", authMiddleware, createBrand);
router.put("/update-brand/:id", authMiddleware, updateBrand);
router.delete("/delete-brand/:id", authMiddleware, deleteBrand);
router.get("/get-brand/:id", authMiddleware, getBrand);
router.get("/getall-brand",  getAllBrand);


module.exports = router;