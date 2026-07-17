import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {Category} from "../models/category.model.js";
import {ApiResponse} from "../utils/ApiResponse.js";


export const createCategory = asyncHandler(async (req, res) => {
    const {name,parent} = req.body;
    if (!name) {
        throw new ApiError("name and parent are required",402);
    }
    const existing = await Category.findOne({ name });

    if(existing){
        throw new ApiError("Category already exists",400);
    }
    if(parent){
        const parentCategory = await Category.findById(parent);

        if(!parentCategory){
            throw new ApiError("Parent category not found",404);
        }
    }
    const category = await Category.create({
        name,
        parent
    })

    return res.status(201).json(new ApiResponse("category is created success",200, category));

})

export const updateCategory = asyncHandler(async (req, res) => {
    const {name, parent} = req.body;
    const {categoryId} = req.params;
    const updates = {};
    if (name){
        updates.name = name;
    }
    if (parent){
        updates.parent = parent;
    }
    const category = await Category.findByIdAndUpdate(
        categoryId,
        updates,
        { new: true }
    );
    return res.status(200).json(
        new ApiResponse(
            "Category updated successfully",
            200,
            category
        )
    );
})
export const deleteCategory = asyncHandler(async (req, res) => {
    const {categoryId} = req.params;
    if (!categoryId){
        throw new ApiError("category ID is required",403)
    }
    const category = await Category.findByIdAndDelete(categoryId)
    const hasChildren = await Category.exists({
        parent: categoryId
    });

    if(hasChildren){
        throw new ApiError(
            "Delete child categories first",
            400
        );
    }
    return res.status(201).json(new ApiResponse("category is deleted success", category));
})

export const getAllCategory = asyncHandler(async (req, res) => {
    const category = await Category.find().populate('parent');
    return res.status(200).json(new ApiResponse(
            "All categories fetched successfully",
            200,
            category
        )
    );
})