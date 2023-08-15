const express = require("express");

const { createUser,
     loginUser, 
     getallUser, 
     getaUser, 
     deleteaUser, 
     updateUser,
     blockUser,
      unBlockUser, 
      handlerRefreshToken,
       logout,
       updatePassword,
       forgotPasswordToken,
       resetPassword
     } = require("../controller/userController");
const { authMiddleware, isAdmin} = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.get("/all-users", authMiddleware, getallUser);
router.get("/refreshToken", handlerRefreshToken );
router.get("/logout", logout );
router.get("/userid/:id", authMiddleware,  getaUser);
router.delete("/delete/:id", authMiddleware, deleteaUser);
router.put("/update",  authMiddleware,updateUser);
router.put("/update-password",  authMiddleware,updatePassword);
router.put("/block-user/:id",  authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id",  authMiddleware, isAdmin, unBlockUser );



module.exports = router;