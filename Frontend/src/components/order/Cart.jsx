import React from 'react';
import { CartItem } from './CartItem.jsx';
import { SummaryCart } from './SummaryCart.jsx';
import {useSelector} from "react-redux";


const Cart = () => {



    const user = useSelector(state => state.auth.user);
    const isAdmin = Boolean(user?.role==="admin");


    const getSelectedVariant = (cartItem) => {
        const targetVariantId = cartItem.variantId;
        return cartItem.product.variants.find((variant) => variant._id === targetVariantId);
    }
    const charges =  150
    const cart = useSelector(state => state.cart.cart)

    const subtotal=cart?.item?.reduce((acc, item) => acc + getSelectedVariant(item).price*item?.quantity, 0)

    return (

        <div className="min-h-screen w-full bg-[#0b0f19] bg-gradient-to-b from-[#0f172a] to-[#0b0f19] text-slate-100 p-4 sm:p-8 lg:p-12 transition-all duration-300">
            <div className="max-w-7xl mx-auto">


                <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-8 text-slate-100">
                    Shopping Cart <span className="text-sm font-normal text-slate-400 ml-2">({cart?.item?.length || 0} items types)</span>
                </h1>


                <div className="flex flex-col lg:flex-row gap-8 items-start w-full">


                    <div className="flex flex-col gap-4 w-full lg:w-3/5 xl:w-2/3 shrink-0">
                        {cart?.item?.length > 0 && isAdmin===false ? (
                            cart?.item?.map((item) => {
                                const matchedVariant = getSelectedVariant(item);
                                if (!matchedVariant) return null;
                               return(
                                   <CartItem

                                       key={item?._id}
                                       productId={item.product?._id}
                                       price={matchedVariant.price}
                                       productImage={matchedVariant.images[0]}
                                       productname={item?.product?.name}
                                       rating={item?.product?.rating}
                                       quantity={item?.quantity || 0}
                                       variantId={matchedVariant._id}
                                       variantName={matchedVariant.variantName}

                                   />
                               )
                            })
                        ) : (

                            <div className="flex flex-col items-center justify-start p-12 bg-[#0f172a]/20 border border-slate-800/60 rounded-2xl text-slate-400">
                                <p className="text-lg font-medium">Your cart is empty</p>
                            </div>
                        )}
                    </div>




                    <div className="w-full lg:w-2/5 xl:w-1/3 lg:sticky lg:top-24">
                        <SummaryCart subtotal={subtotal}  charges={charges}  />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;

