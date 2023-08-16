const Category = require('../models/blogCategoryModel');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");

const createBlogCategory = asyncHandler( async (req, res) => {
    try {
        const newBlogCategory = await Category.create(req.body);
        res.json(newBlogCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const updateBlogCategory = asyncHandler( async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updatedBlogCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedBlogCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBlogCategory = asyncHandler( async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deletedBlogCategory = await Category.findByIdAndDelete(id);
        res.json(deletedBlogCategory);
    } catch (error) {
        throw new Error(error);
    }
});


const getBlogCategory = asyncHandler( async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaBlogCategory = await Category.findById(id);
        res.json(getaBlogCategory);
    } catch (error) {
        throw new Error(error);
    }
});


const getAllBlogCategory = asyncHandler( async (req, res) => {
    try {
        const getallBlogCategory = await Category.find();
        res.json(getallBlogCategory);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {createBlogCategory, updateBlogCategory, deleteBlogCategory, getBlogCategory, getAllBlogCategory};