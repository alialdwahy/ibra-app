const express = require("express");
const {authMiddleware} = require("../middlewares/authmiddleware");
const { createBlogCategory, updateBlogCategory, deleteBlogCategory, getBlogCategory, getAllBlogCategory } = require("../controller/blogCategoryController");
const router = express.Router();


router.post("/create-blogCategory", authMiddleware, createBlogCategory);
router.put("/update-blogCategory/:id", authMiddleware, updateBlogCategory);
router.delete("/delete-blogCategory/:id", authMiddleware, deleteBlogCategory);
router.get("/get-blogCategory/:id", authMiddleware, getBlogCategory);
router.get("/getall-blogCategory", getAllBlogCategory);


module.exports = router;