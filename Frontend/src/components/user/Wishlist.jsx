import {useEffect, useState} from 'react';
import { WishlistCard } from './WishlistCard';
import {toast} from "react-hot-toast";
import {PageLoader} from "../loaders/PageLoader.jsx";
import api from "../../config/api.js";

const Wishlist = () => {

    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchWishlistItems = async () => {
        try{
            const response = await api
                .get(`/wishlist`,{
                    withCredentials: true
                })
            setWishlistItems(response.data.data);

        }catch(error){
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchWishlistItems();
    },[])
    const handleRemovePlaceholder =async (id) => {
        try{
            const response = await api
                .delete(`/wishlist/${id}`,{
                    withCredentials: true
                })
            setWishlistItems(response.data.data);

            toast.success("Item removed Successfully.");

        }catch(error){

            toast.error("Failed to remove item");

        }

    };

    if (loading) {
        return <PageLoader/>;
    }

    return (
        <div className="min-h-screen bg-[#0B0F17] text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">


                <div className="mb-8 border-b border-slate-800 pb-5">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        My Wishlist
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Keep track of items you want to pick up later.
                    </p>
                </div>


                {(!wishlistItems?.products || wishlistItems.products.length === 0)? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-2xl bg-[#0F131C]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-600 mb-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        <h3 className="text-lg font-medium text-slate-400">Your wishlist is empty</h3>
                        <p className="text-slate-500 text-xs mt-1">Explore our products section to add some items!</p>
                    </div>
                ) : (

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlistItems?.products?.map((item) => (
                            <WishlistCard
                                productId={item._id}
                                key={item._id}
                                product={item}
                                onRemove={() => handleRemovePlaceholder(item._id)}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Wishlist;