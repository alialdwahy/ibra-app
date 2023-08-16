const Category = require('../models/productCategoryModel');
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbid");

const createProductCategory = asyncHandler( async (req, res) => {
    try {
        const newProductCategory = await Category.create(req.body);
        res.json(newProductCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const updateProductCategory = asyncHandler( async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updatedProductCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedProductCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteProductCategory = asyncHandler( async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deletedProductCategory = await Category.findByIdAndDelete(id);
        res.json(deletedProductCategory);
    } catch (error) {
        throw new Error(error);
    }
});


const getProductCategory = asyncHandler( async (req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaProductCategory = await Category.findById(id);
        res.json(getaProductCategory);
    } catch (error) {
        throw new Error(error);
    }
});


const getAllProductCategory = asyncHandler( async (req, res) => {
    try {
        const getallProductCategory = await Category.find();
        res.json(getallProductCategory);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {createProductCategory, updateProductCategory, deleteProductCategory, getProductCategory, getAllProductCategory};