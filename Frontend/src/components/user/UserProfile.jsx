import {ProfileCard} from "./ProfileCard.jsx";
import {useSelector} from "react-redux";
import { useEffect, useState} from "react";
import {Orders} from "../order/Orders.jsx";
import {useNavigate} from "react-router-dom";
import {PageLoader} from "../loaders/PageLoader.jsx";
import api from "../../config/api.js";


const UserProfile = ({
                                name = "Jane Doe",
                                phone = "+1 (555) 019-2834",
                                email = "jane.doe@example.com",
                                avatar
                            }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.auth.user);
    const [orders, setOrders] = useState([]);
    useEffect(()=>{
        const fetchUserOrders = async () => {
            try{
                const response =  await api
                    .get(`/order`)

                setOrders(response.data.data);
            }catch(err){

                console.error(err);
            }finally{
                setLoading(false);
            }

        }
        fetchUserOrders();
    },[])

    const completedOrders = orders.filter(order => order.status==="Delivered");


    return (
        <div className="bg-black text-white min-h-screen p-6">


            <div className="max-w-3xl mx-auto space-y-3">

                <ProfileCard
                    avatar={user?.avatar}
                    name={user?.name}
                    email={user?.email}
                    phone={user?.phone||"not available"}
                />

                {
                    loading ? (
                        <PageLoader />
                    ):(
                        <>
                            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.7)]">

                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-medium text-zinc-100">
                                        My Orders
                                    </h2>
                                    <button className="text-sm text-zinc-400 hover:text-white transition duration-300"
                                            onClick={()=>{
                                                navigate("/orders");
                                            }}
                                    >
                                        View All
                                    </button>
                                </div>

                                {completedOrders.length > 0 ? (
                                    <>


                                        <div className="max-w-5xl mx-auto">
                                            {completedOrders.map((order) => (
                                                order.item?.map((itemElement) => (
                                                    <Orders
                                                        key={itemElement?._id}
                                                        name={itemElement?.product?.name}
                                                        images={itemElement?.product?.variants[0]?.images?.[0]}
                                                        quantity={itemElement?.quantity}
                                                        totalprice={order.totalAmount}
                                                        deliveredAt={order?.delivered}
                                                        createdAt={order?.createdAt}
                                                        status={order?.status}
                                                        productId={itemElement?.product?._id}
                                                    />
                                                ))
                                            ))
                                            }

                                        </div>
                                    </>

                                ) : (
                                    <div className="border border-dashed border-zinc-800 rounded-2xl p-10 text-center">
                                        <p className="text-sm text-zinc-500">
                                            You haven’t placed any orders yet.
                                        </p>
                                    </div>
                                )}

                            </div>

                        </>

                    )
                }


            </div>
        </div>
    );
};

export default UserProfile;