import {Orders} from "./Orders.jsx";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import api from "../../config/api.js";
import {useSelector} from "react-redux";
const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const fetchUserOrders = async () => {
        try{
            const response =  await api
                .get(`/order`)

            setOrders(response.data.data);
        }catch(err){
            console.log(err);
        }

    }
    const {isAuthenticated} = useSelector((state) => state.auth);
    useEffect(()=>{
        if (!isAuthenticated) return
        fetchUserOrders();
    },[isAuthenticated]);


    const getSelectedVariant = (item) => {
        const variantId = item.variantId
        return item.product?.variants?.find((variant) => variant._id === variantId);
    }
    return (
        <>
            {
                orders.length > 0 ?(
                    <div className="min-h-[68vh]]">
                        {
                            orders?.map((order) => (
                                order?.item?.map((itemElement)=> {
                                    const matchedVariant = getSelectedVariant(itemElement)
                                    const itemPrice = (matchedVariant?.price || 0) * (itemElement?.quantity || 0);
                                    return (
                                        <Orders
                                            productId={itemElement?.product?._id}
                                            key={`${order._id}-${itemElement?._id || itemElement?.product?._id}`}
                                            name={itemElement?.product?.name}
                                            images={matchedVariant?.images?.[0]}
                                            totalprice={itemPrice}
                                            deliveredAt={order?.delivered}
                                            createdAt={order?.createdAt}
                                            status={order?.status}
                                            quantity={itemElement?.quantity}

                                        />
                                    )

                                })
                            ))
                        }
                    </div>

                ):(
                    <>
                        <div className="min-h-[69vh] flex flex-col items-center justify-center text-center px-4">

                            <div className="w-20 h-20 bg-blue-950/40 border border-blue-900 rounded-full flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(30,58,138,0.3)]">
                                📦
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                                No Orders Yet
                            </h2>

                            <p className="text-gray-400 max-w-sm mb-8 text-sm leading-relaxed">
                                Your order history is looking a bit empty! Discover our premium collections and place your very first order today.
                            </p>

                            <Link
                                to="/products"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-600/20 transform hover:-translate-y-0.5"
                            >
                                Explore Products
                            </Link>
                        </div>
                    </>

                )
            }

        </>
    )
}

export default MyOrders;