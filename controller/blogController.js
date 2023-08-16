const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");


const createBlog = asyncHandler(async (req, res) => {
     try {
        const newBlog = await Blog.create(req.body);
        res.json({
            status: "true",
            message: "success",
            newBlog,
        })

     }catch (error) {
        throw new Error(error);
     }
});


const updateBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
       const updaatedBlog = await Blog.findByIdAndUpdate(id,req.body,{
        new: true,
       });
       res.json({
           status: "true",
           message: "update success",
           updaatedBlog,
       })

    }catch (error) {
       throw new Error(error);
    }
});


const getBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
       const gettBlog = await Blog.findById(id).populate("likes");
      const updateViews = await Blog.findByIdAndUpdate(id, {
        $inc: {numViews:1},
       },
       {new: true,}
       );
       res.json({
           status: "true",
           message: "success",
           gettBlog,
           updateViews,
       })

    }catch (error) {
       throw new Error(error);
    }
});

const getAllBlog = asyncHandler(async (req, res) => {
    try {
       const getallBlog = await Blog.find();
       res.json({
           status: "true",
           message: "success",
           getallBlog,
       })

    }catch (error) {
       throw new Error(error);
    }
});

const deleteBlog = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
       const deletedBlog = await Blog.findByIdAndDelete(id);
       res.json({
           status: "true",
           message: "delete success",
           deletedBlog,
       });
    }catch (error) {
       throw new Error(error);
    }
});

const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
        //Find the blog which you want to be liked
       const blog = await Blog.findById(blogId);
       // Find the login uer
       const loginUserId = req?.user?._id;
       // Find if the user has liked the blog
       const isLiked = blog?.isLiked;
       // Find if the user has disliked the blog
       const alreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
       );
       if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes: loginUserId},
            isLiked: false
        },{new: true,}
        );
        res.json( blog);
       };
       if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {dislikes: loginUserId},
            isDisliked: false
        },{new: true,},
        );
    res.json(blog);
} else {
    const blog = await Blog.findByIdAndUpdate(blogId, {
        $push: {likes: loginUserId},
        isDisliked: true
    },{new: true,},
    );
res.json({
    status: "true",
    message: "success",
    blog,
}
);
}
});


const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
        //Find the blog which you want to be liked
       const blog = await Blog.findById(blogId);
       // Find the login uer
       const loginUserId = req?.user?._id;
       // Find if the user has liked the blog
       const isDisliked = blog?.isDisliked;
       // Find if the user has disliked the blog
       const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
       );
       if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {dislikes: loginUserId},
            isDisliked: false
        },{new: true,}
        );
        res.json( blog);
       };
       if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: {likes: loginUserId},
            isDisliked: false
        },{new: true,},
        );
    res.json(blog);
} else {
    const blog = await Blog.findByIdAndUpdate(blogId, {
        $push: {likes: loginUserId},
        isDisliked: true
    },{new: true,},
    );
res.json({
    status: "true",
    message: "success",
    blog,
}
);
}
});

module.exports = {createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog};