import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {geminiAIVector, geminiChat} from "../utils/ai.Gemini.js";
import {Product} from "../models/product.model.js";
import {buildProductContext} from "../utils/ai.Context.js";
import {ApiResponse} from "../utils/ApiResponse.js";

export const chatWithAI = asyncHandler(async (req, res) => {
        const { query ,productId} = req.body;
        if (!query || !productId) {
            throw new ApiError("Query and productId both needed.",403)
        }

    const searchVector =await geminiAIVector(query)
    const currentProduct = await Product.findById(productId).populate('category')


    const products = await Product.aggregate([
        {
            $vectorSearch:{
                index:"vector_index",
                path:"product_embedding",
                queryVector:searchVector,
                numCandidates:100,
                limit:5
            }
        }
    ])

    if (products?.length === 0) {
        return res.status(200).json(
            new ApiResponse(
                "No matching products found",
                200,
                "Sorry, I couldn't find a suitable product."
            )
        );
    }

    const populatedProducts = await Product.populate(products, {
        path: "category"
    });

        const formattedProducts = buildProductContext(populatedProducts);


    const prompt = `
You are ShopFix AI, an intelligent shopping assistant for the ShopFix e-commerce platform.

Your job is to answer customer questions using ONLY the product information provided below.

=========================
CURRENT PRODUCT
=========================

The customer is currently viewing this product.

Name:
${currentProduct.name}

Category:
${currentProduct.category?.name ?? "N/A"}

Description:
${currentProduct.description}

Specifications:
${JSON.stringify(currentProduct.specification, null, 2)}

Price:
${currentProduct.price ?? "Not Available"}

Variants:
${currentProduct.variants?.length ?? 0}

=========================
RELATED PRODUCTS
=========================

${formattedProducts}

=========================
CUSTOMER QUESTION
=========================

${query}

=========================
RULES
=========================

1. Treat the CURRENT PRODUCT as the primary product whenever the customer says:
- this
- it
- this laptop
- this phone
- this product

2. Use RELATED PRODUCTS only when:
- comparing products
- suggesting alternatives
- recommending a better option

3. Never invent:
- specifications
- prices
- ratings
- stock
- variants
- features

4. If information is missing, simply say:
"That information isn't available."

5. Never mention:
- AI
- prompts
- embeddings
- vector search
- databases
- internal systems

6. Keep answers concise but helpful.

=========================
SPECIAL BEHAVIOR
=========================

If the customer asks:

"Is this good for programming?"

Assume "this" means the CURRENT PRODUCT.

If the customer asks:

"Compare this with Dell"

Compare the CURRENT PRODUCT with the matching product from RELATED PRODUCTS.

If the customer asks:

"What should I buy?"

Recommend the best product from RELATED PRODUCTS and explain why.

=========================
FORMAT
=========================

Whenever appropriate respond using:

Recommendation

Why

Key Specifications

Pros

Cons

Alternative (if available)
`;

        const AIresponse = await geminiChat(prompt);

        console.log("AIresponse", AIresponse);
    return res.status(200).json(
        new ApiResponse(
            "AI response generated successfully",
            200,
            AIresponse
        )
    );



})

