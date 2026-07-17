
export const SearchSuggestion = ({ product, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="
                flex
                items-center
                gap-4
                p-3
                cursor-pointer
                hover:bg-base-200
                transition-colors
                border-b
                border-base-200
            "
        >
            <img
                src={product?.variants?.[0]?.images?.[0]}
                alt={product.name}
                className="
                    w-14
                    h-14
                    rounded-lg
                    object-cover
                    bg-base-300
                    flex-shrink-0
                "
            />

            <div className="flex-1 overflow-hidden">
                <h3 className="font-medium truncate">
                    {product.name}
                </h3>

                <p className="text-sm opacity-60 truncate">
                    {product.category?.name}
                </p>
            </div>

            <div className="font-semibold whitespace-nowrap">
                ₹{product?.variants?.[0]?.price?.toLocaleString()}
            </div>
        </div>
    );
}