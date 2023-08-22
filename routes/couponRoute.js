const express = require("express");
const { createCoupon, getAllCoupon, updateCoupon, deleteCoupon } = require("../controller/couponController");
const { authMiddleware, isAdmin } = require("../middlewares/authmiddleware");
const router = express.Router();


router.post("/create-coupon",authMiddleware, isAdmin, createCoupon);
router.put("/update-coupon/:id",authMiddleware, isAdmin, updateCoupon);
router.get("/get-all-coupon",authMiddleware, isAdmin, getAllCoupon);
router.delete("/delete-coupon/:id",authMiddleware, isAdmin, deleteCoupon);


module.exports = router;