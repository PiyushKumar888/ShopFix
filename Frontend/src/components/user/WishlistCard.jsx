import {Link} from "react-router-dom";

export const WishlistCard = ({productId, product, onRemove }) => {

    const {

        name = "Product Title",
        description = "Short product description goes here...",
        variants = []
    } = product || {};


    const displayImage = variants[0]?.images[0] || "https://via.placeholder.com/300";
    const displayPrice = variants[0]?.price ? `₹${variants[0].price}` : "₹0";

    return (
        <div className="card bg-[#121620] border border-slate-800 rounded-xl overflow-hidden shadow-xl hover:border-slate-700 transition-all duration-200">

            <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                <img
                    loading="lazy"
                    src={displayImage}
                    alt={name}
                    className="w-full h-full object-cover"
                />


                <button
                    onClick={onRemove}
                    className="absolute top-3 right-3 bg-black/60 hover:bg-error text-white p-2 rounded-full transition-colors group"
                    title="Remove from Wishlist"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>


            <div className="p-5 flex flex-col justify-between gap-4 h-[180px]">
                <div>
                    <h3 className="font-semibold text-lg text-white line-clamp-1">
                        {name}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                        {description}
                    </p>
                </div>


                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold text-white">
                        {displayPrice}
                    </span>
                    <Link className="btn btn-sm bg-[#5B50FF] hover:bg-[#483DE6] text-white border-none rounded-lg px-4 normal-case"
                     to={`/products/${productId}`}

                    >
                        View Product
                    </Link>
                </div>
            </div>
        </div>
    );
};