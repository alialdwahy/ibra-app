const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authmiddleware");
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog, uploadImages } = require("../controller/blogController");
const { blogImageResize, uploadPhoto } = require("../middlewares/uploadImages");
const router = express.Router();




router.post('/create-blog', authMiddleware, isAdmin, createBlog);
router.put("/update-blog/:id", authMiddleware, isAdmin, updateBlog);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array('images',2),blogImageResize,uploadImages);
router.get("/get-blog/:id", authMiddleware, getBlog);
router.get("/get-all-blog",  getAllBlog);
router.delete("/delete-blog/:id", authMiddleware, isAdmin, deleteBlog);
router.put("/likes",authMiddleware, likeBlog)
router.put("/dislikes",authMiddleware, dislikeBlog)



module.exports = router;