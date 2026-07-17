

import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {setCart} from "../../features/cart/cartSlice.js";
import {toast} from "react-hot-toast";
import {Spinner} from "../loaders/Spinner.jsx";
import api from "../../config/api.js";

export const CartItem = (
    {   productId
        ,productImage,
        productname="Product",
        price, rating,
        quantity=1 ,
        variantId,
    }) => {
    const arr = [1, 2, 3, 4, 5];
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const updateCartHandler = async (quantity) => {
        if (quantity<=0){
            return;
        }
       try{
            setLoading(true);
           const response = await api
               .put(`/cart`,{
                   productId: productId,
                   variantId:variantId,
                   quantity: quantity,
               })

           dispatch(setCart(response.data.data));
       }catch(err){
           if (err.response?.status === 400) {
               toast.error("Out of stock", { id: "stock-limit" });
           } else {
               toast.error("Failed to update cart");
           }
       }finally{
            setLoading(false);
       }

    }
    const removeCartHandler = async () => {
        try{
            setLoading(true);
            const response = await api
                .delete(`/cart/${productId}/${variantId}`)

            dispatch(setCart(response.data.data));
        }catch(err){
            toast.error("Failed to remove item")

        }finally{
            setLoading(false);
        }
    }
    return (

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-[#0f172a]/40 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl hover:border-slate-700 transition-all duration-300 w-full max-w-[750px]">


            <div className="relative shrink-0 w-full sm:w-32 h-32 bg-[#1e293b] rounded-xl overflow-hidden group border border-slate-800">
                <img
                    loading="lazy"
                    src={productImage}
                    alt={productname}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 brightness-90 group-hover:brightness-100"
                />
            </div>


            <div className="flex flex-col flex-1 min-w-0 h-full justify-between py-1">
                <div>

                    <h2 className="text-lg font-bold text-slate-100 tracking-tight line-clamp-1 hover:text-blue-400 cursor-pointer transition-colors">
                        {productname}
                    </h2>


                    <div className="flex items-center gap-2 mt-1.5">
                        <div className="rating rating-xs rating-half pointer-events-none">
                            {arr.map((star) => {
                                if (star <= rating) {
                                    return (
                                        <input key={`full-${star}`} type="radio" className="mask mask-star-2 bg-amber-400" disabled checked />
                                    );
                                } else if (star - 0.5 <= rating) {
                                    return (
                                        <input key={`half-${star}`} type="radio" className="mask mask-star-2 mask-half-1 bg-amber-400" disabled checked />
                                    );
                                } else {
                                    return (
                                        <input key={`empty-${star}`} type="radio" className="mask mask-star-2 bg-slate-700" disabled />
                                    );
                                }
                            })}
                        </div>
                        <span className="text-xs text-slate-400 font-semibold mt-0.5">
                            {Number(rating)}
                        </span>
                    </div>
                </div>


                <div className="flex items-center bg-[#1e293b] rounded-lg w-fit mt-4 border border-slate-700/50 overflow-hidden h-8">
                    <button
                        disabled={loading}
                        onClick={() => (updateCartHandler(quantity-1))}
                        className="px-3 text-slate-400 hover:bg-slate-700 hover:text-slate-100 font-bold transition-colors h-full text-sm"
                    >
                        −
                    </button>
                    <span className="px-3 font-semibold text-sm w-10 text-center select-none text-slate-200">
                        {Number(quantity)||0}
                    </span>
                    <button
                        disabled={loading}
                        onClick={() => (updateCartHandler(quantity+1))}
                        className="px-3 text-slate-400 hover:bg-slate-700 hover:text-slate-100 font-bold transition-colors h-full text-sm"
                    >
                        +
                    </button>
                </div>
            </div>


            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between h-full sm:h-32 w-full sm:w-auto border-t sm:border-t-0 border-slate-800/60 pt-4 sm:pt-0 shrink-0 self-stretch">


                <p className="text-xl font-extrabold text-slate-100 sm:text-right tracking-tight">
                    ₹{(Number(price) * Number(quantity)).toLocaleString('en-IN')||0}
                </p>


                <button
                    className="btn btn-ghost btn-circle text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 btn-sm transition-all duration-200"
                    aria-label="Delete item"
                    disabled={loading}
                    onClick={()=>removeCartHandler()}
                >
                    {
                        loading?(
                            <Spinner className={"w-4 h-4"}/>
                        ):(
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                        )
                    }

                </button>

            </div>
        </div>
    );
};