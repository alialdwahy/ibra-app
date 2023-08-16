const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authmiddleware");
const { createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog } = require("../controller/blogController");
const router = express.Router();




router.post('/create-blog', authMiddleware, isAdmin, createBlog);
router.put("/update-blog/:id", authMiddleware, isAdmin, updateBlog);
router.get("/get-blog/:id", authMiddleware, getBlog);
router.get("/get-all-blog", authMiddleware, getAllBlog);
router.delete("/delete-blog/:id", authMiddleware, isAdmin, deleteBlog);
router.put("/likes",authMiddleware, likeBlog)
router.put("/dislikes",authMiddleware, dislikeBlog)



module.exports = router;