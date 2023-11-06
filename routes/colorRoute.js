const express = require("express");
const {authMiddleware} = require("../middlewares/authmiddleware");
const { createColor, updateColor, deleteColor, getColor, getAllColor } = require("../controller/colorController");
const router = express.Router();


router.post("/create-color", authMiddleware, createColor);
router.put("/update-color/:id", authMiddleware, updateColor);
router.delete("/delete-color/:id", authMiddleware, deleteColor);
router.get("/get-color/:id", authMiddleware, getColor);
router.get("/getall-color",  getAllColor);


module.exports = router;