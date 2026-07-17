import {Product} from "../models/product.model.js"
import {uploadToCloudinary} from "../config/cloudinary.js";
import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import {geminiAIVector} from "../utils/ai.Gemini.js";
import {Category} from "../models/category.model.js";
import mongoose from "mongoose";


export const getProduct = asyncHandler(async (req, res) => {
      const {
          keyword,
          minprice,
          maxprice,
          categoryId,
          rating,
          page=1,
          limit=10
      }= req.query
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

      let pipeline = []
      if (keyword){
          pipeline.push({
              $match:{
                  name:{
                      $regex:keyword,
                      $options:"i"
                  }

              }
          })
      }
    if (rating){
        pipeline.push({
            $sort:{rating:-1},
        })
    }
      if(minprice||maxprice){
          const priceFilter = {}
          if (maxprice){
              priceFilter.$lte = Number(maxprice)
          }
          if (minprice){
              priceFilter.$gte = Number(minprice)
          }
          pipeline.push({
              $match:{
                  "variants.price":priceFilter
              }
          })
      }
    if (categoryId) {

        const childCategories = await Category.find({
            parent: categoryId
        }).select("_id");

        const categoryIds = [
            new mongoose.Types.ObjectId(categoryId),
            ...childCategories.map(cat => cat._id)
        ];

        pipeline.push({
            $match: {
                category: {
                    $in: categoryIds
                }
            }
        });
    }

    if (pipeline.length === 0) {
        pipeline.push({
            $match: {}
        });
    }

    const copyPipeline = [...pipeline,{$count:"total"}]; //cause this return {total:10} example
    const totalProducts =await Product.aggregate(copyPipeline);
    const totalProductCount = totalProducts[0]?.total||0
    const skipval = (pageNumber-1)*limitNumber;
    pipeline.push({$skip:skipval});
    pipeline.push({$limit:limitNumber});
    const totalPages = Math.ceil((Number(totalProductCount)/Number(limit)));


    const product =await Product.aggregate(pipeline)

    const populatedProduct = await Product.populate(product, [
        {
            path: "category"
        },
        {
            path: "reviews",
            populate: {
                path: "user"
            }
        }
    ]);



      return res.status(200)
          .json( new ApiResponse
          ("Product fetched successfully"
              ,200
              ,{
                  products:populatedProduct,
                  pagination: {
                      totalProducts: totalProductCount,
                      totalPages,
                      currentPage: pageNumber,
                      limit: limitNumber,
                  }
              },))
})

export const getProductById = asyncHandler(async (req, res) => {
    const productId = req.params.id
    const product = await Product.findById(productId)
    if (!product){
        throw new ApiError("Product not found",404)
    }
    const populatedProduct = await Product.populate(product, [
        {
            path: "category",
            populate:{
                path:"parent"
            }
        },
        {
            path: "reviews",
            populate: {
                path: "user"
            }
        }
    ]);

    return res.status(200).json(new ApiResponse("Product found successfully",200,populatedProduct))
})

export const createProduct = asyncHandler(async (req, res) => {
     const{
         name,
         description,
         categoryId,
         specification,
         variants,


     } = req.body

    if(!name  || !description || !categoryId  ){
        throw new ApiError("Core fields are required ",400)
    }
    const hasVariants = variants.length > 0
    let finalVariants = []
    if (hasVariants){
        const parsedvariants = JSON.parse(variants);

        for (let i = 0; i < parsedvariants.length; i++){
            const currentVariant = parsedvariants[i]
            let variantImages = []
            const fieldName = `variant_images_${i}`
            if (req.files && req.files[fieldName]){
                for ( let file of req.files[fieldName]){
                    const response = await uploadToCloudinary(file.path);

                    variantImages.push( response.secure_url)
                }
            }
            finalVariants.push({
                price:currentVariant.price,
                stock:currentVariant.stock,
                variantName:currentVariant.variantName,
                images:variantImages,
            })

        }

    }
    const category = await Category.findById(categoryId)
    if (!category) {
        throw new ApiError("Invalid category", 400);
    }
    const textToEmbed = `Product Name: ${name}. Category: ${category.name}. Description: ${description}`;
    const embeddingVector = await geminiAIVector(textToEmbed);
    let parsedSpecification = specification

    if (specification) {
        parsedSpecification = JSON.parse(specification)//Note Map need to be converted mongo doesnt understand that
    }


    const product =await Product.create({
        name,
        description,
        category:categoryId,
        variants:finalVariants,
        specification:parsedSpecification,
        hasVariants:hasVariants,
        product_embedding:embeddingVector,
    })
    if (!product){
        throw new ApiError("Product not created ",402)
    }
    return res.status(200).json(new ApiResponse("Product created successfully",200,product))
})

export const updateProduct = asyncHandler(async (req, res) => {
    const updates = {}
    const {
        name,
        description,
        categoryId,
        specification,
        variants,
        hasVariants,
    } = req.body
    const productId = req.params.id
    if (!productId){
        throw new ApiError("Product not found",404)
    }
    if (name){
        updates.name = name
    }

    if (description){
        updates.description = description
    }
    let category = null
    if (categoryId){
        category = await Category.findById(categoryId);
        if (!category){
            throw new ApiError("Category not found",404)
        }
        updates.category = categoryId
    }
    let finalVariants = []
    if (variants){
        const parsedvariants = JSON.parse(variants);
        for (let i = 0; i < parsedvariants.length; i++){
            const currentVariant = parsedvariants[i]
            let variantImages = currentVariant.images

            const fieldName = `variant_images_${i}`
            if (req.files && req.files[fieldName] && req.files[fieldName].length>0){
                let newUpdatedImages = []
                for ( let file of req.files[fieldName]){
                    const response = await uploadToCloudinary(file.path);

                     newUpdatedImages.push( response.secure_url)
                }
                variantImages = newUpdatedImages
            }
            finalVariants.push({
                price:currentVariant.price,
                stock:currentVariant.stock,
                variantName:currentVariant.variantName,
                images:variantImages,
            })
        }
        updates.variants = finalVariants
    }
    if (hasVariants!==undefined){
        updates.hasVariants = hasVariants
    }

    let parsedSpecification = specification;

    if (specification) {
      parsedSpecification = JSON.parse(specification)//Note Map need to be converted mongo doesnt understand that
        updates.specification = parsedSpecification
    }
    const currentProduct = await Product.findById(productId).populate("category")
    if (!currentProduct) {
        throw new ApiError("Product not found in database", 404);
    }

    if (name||category||description){
        const embeddedName = name || currentProduct.name;
        const embeddedCategory = category?category.name:currentProduct.category.name;;
        const embeddedDescription = description || currentProduct.description;

        const textToEmbed = `Product Name: ${embeddedName}. Category: ${embeddedCategory}. Description: ${embeddedDescription}`;
        const embeddingVector = await geminiAIVector(textToEmbed);
        updates.product_embedding = embeddingVector
    }


    const updatedProduct = await Product.findByIdAndUpdate(productId,updates,{new:true})

    return res.status(200).json(new ApiResponse("Product updated successfully",200,updatedProduct))

})

export const deleteProduct = asyncHandler(async (req, res) => {
    const ProductId = req.params.id

    if (!ProductId){
        throw new ApiError("Product not found",404)
    }
    const product = await Product.findByIdAndDelete(ProductId)

    if (!product){
        throw new ApiError("failed to delete the product", 404);
    }

    return res.status(200).json(new ApiResponse("Product deleted successfully",200))
})



export const searchProductsAI = asyncHandler(async (req, res) => {
    const {query} = req.query

    if (!query){
        throw new ApiError("Search query parameter is required", 400);
    }
    const searchVector =await geminiAIVector(query)

    const products = await Product.aggregate([
        {
            $vectorSearch:{
                index:"vector_index",
                path:"product_embedding",
                queryVector:searchVector,
                numCandidates:100,
                limit:10
            }
        }
    ])
    const populatedProduct = await Product.populate(products, [
        {
            path: "category"
        },
        {
            path: "reviews",
            populate: {
                path: "user"
            }
        }
    ]);


    return res.status(200).json(
        new ApiResponse( "All products searched using AI successfully",200,populatedProduct)
    );

})

export const recommendProducts = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    if (!productId) {
        throw new ApiError("Product ID is required", 400);
    }

    const currentProduct = await Product.findById(productId);

    if (!currentProduct) {
        throw new ApiError("Product not found", 404);
    }

    const recommendedProducts = await Product.aggregate([
        {
            $vectorSearch: {
                index: "vector_index",
                path: "product_embedding",
                queryVector: currentProduct.product_embedding,
                numCandidates: 100,
                limit: 7
            }
        }
    ]);


    const filteredProducts = recommendedProducts.filter(
        product => product._id.toString() !== productId
    );

    const populatedProducts = await Product.populate(filteredProducts, [
        {
            path: "category"
        },
        {
            path: "reviews",
            populate: {
                path: "user"
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            "Recommended products fetched successfully",
            200,
            populatedProducts
        )
    );

});