const express = require("express");

const {getallUser,getaUser,deleteaUser,updateUser,blockUser,unBlockUser,getWishlist,saveAddress,userCart,
     getUserCart,emptyCart,applyCoupon,createOrder,getOrders, updateOrderStatus} = require("../controller/userController");
const {createUser,loginUser,handlerRefreshToken,logout,updatePassword,
     forgotPasswordToken,resetPassword,loginAdmin} = require("../controller/authController");
const { authMiddleware, isAdmin} = require("../middlewares/authmiddleware");

const router = express.Router();


// Auth Router
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/login-admin", loginAdmin);
router.put("/update-password",  authMiddleware,updatePassword);
router.get("/refreshToken", handlerRefreshToken );
router.get("/logout", logout );
router.post("/forgot-password", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);





// Users Router
router.post("/add-cart", authMiddleware, userCart);
router.post("/apply-coupon", authMiddleware, applyCoupon);
router.post("/create-order", authMiddleware, createOrder);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/get-cart", authMiddleware, getUserCart);
router.get("/all-users", getallUser);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/userid/:id", authMiddleware,  getaUser);
router.delete("/delete/:id", authMiddleware, deleteaUser);
router.put("/update",  authMiddleware,updateUser);
router.put("/update-order-status/:id",  authMiddleware,isAdmin, updateOrderStatus);
router.put("/save-address",  authMiddleware,saveAddress);
router.put("/block-user/:id",  authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id",  authMiddleware, isAdmin, unBlockUser );
router.delete("/empty-cart",  authMiddleware, emptyCart );



module.exports = router;