
export const buildProductContext = (products) => {
    let context = "";

    for (const product of products) {

        context += `
            Product
            
            Name: ${product.name ?? "N/A"}
            Description: ${product.description}
            Category: ${product.category.name}
            Rating: ${product.rating}
            
            Specifications:
            `;

        Object.entries(product?.specification ?? {}).forEach(([key, value]) => {
            context += `${key}: ${value}\n`;
        });

        context += "\nVariants:\n";

        if (product.variants?.length > 0) {
                        for (const variant of product.variants) {
                            context += `
            Variant: ${variant.variantName ?? "Default"}
            Price: ₹${variant.price}
            `;
            }
        }

        context += "\n-----------------------------------------\n";
    }

    return context;
};