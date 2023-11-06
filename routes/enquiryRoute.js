const express = require("express");
const {authMiddleware} = require("../middlewares/authmiddleware");
const { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getAllEnquiry } = require("../controller/enqController");
const router = express.Router();


router.post("/create-enquiry", authMiddleware, createEnquiry);
router.put("/update-enquiry/:id", authMiddleware, updateEnquiry);
router.delete("/delete-enquiry/:id", authMiddleware, deleteEnquiry);
router.get("/get-enquiry/:id", authMiddleware, getEnquiry);
router.get("/getall-enquiry",  getAllEnquiry);


module.exports = router;