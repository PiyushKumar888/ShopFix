import { AdminOrderCard } from "./AdminOrderCard.jsx";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import api from "../../config/api.js";
import {useSelector} from "react-redux";



const AdminOrder = () => {
    const[orders, setOrders] = useState([]);
    const[searchQuery, setSearchQuery] = useState("");

    const {isAuthenticated ,user} = useSelector((state) => state.auth);

    const fetchOrders = async () => {
        try{

            const response = await api
                .get(`/order/admin`)
            setOrders(response.data.data);
        }catch(err){
            console.log(err);

        }

    }
    useEffect(() => {
        if (!isAuthenticated && user.role!=='admin') return;
        fetchOrders();
    },[isAuthenticated])

    const searchOrder = async (email) =>{
        if (!email || !email.trim()) {
            fetchOrders();
            return;
        }
        try{
            const response = await api
                .put(`/order/search`,{email:email.trim()})

            if(email){
                setOrders(response.data.data);
            }
            toast.success("order searched successfully")
        }catch(err){
            console.log(err)
            toast.error("Failed to search order")
        }
    }


    return (
        <div className="min-h-screen bg-gradient-to-r from-[#071326] via-black to-[#071326] text-white">

            <div className="max-w-7xl mx-auto px-6 py-10">


                <div className="mb-10">

                    <h1 className="text-4xl font-bold">
                        Order Management
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Track, manage and update customer orders.
                    </p>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">

                    <div className="bg-[#081223] border border-blue-950 rounded-2xl p-5">
                        <p className="text-gray-400 text-sm">
                            Total Orders
                        </p>

                        <h2 className="text-3xl font-bold mt-2">
                            {orders.length}
                        </h2>
                    </div>

                    <div className="bg-[#081223] border border-yellow-900 rounded-2xl p-5">
                        <p className="text-gray-400 text-sm">
                            Pending
                        </p>

                        <h2 className="text-3xl font-bold mt-2 text-yellow-400">
                            {
                                orders.filter(
                                    order => order.status === "Pending"
                                ).length
                            }
                        </h2>
                    </div>

                    <div className="bg-[#081223] border border-blue-900 rounded-2xl p-5">
                        <p className="text-gray-400 text-sm">
                            Shipped
                        </p>

                        <h2 className="text-3xl font-bold mt-2 text-blue-400">
                            {
                                orders.filter(
                                    order => order.status === "Shipped"
                                ).length
                            }
                        </h2>
                    </div>

                    <div className="bg-[#081223] border border-green-900 rounded-2xl p-5">
                        <p className="text-gray-400 text-sm">
                            Delivered
                        </p>

                        <h2 className="text-3xl font-bold mt-2 text-green-400">
                            {
                                orders.filter(
                                    order => order.status === "Delivered"
                                ).length
                            }
                        </h2>
                    </div>

                </div>


                <div className="mb-8">

                    <input
                        type="text"
                        placeholder="Search by Order ID or Email..."
                        onChange={(e)=>{
                            setSearchQuery(e.target.value||"")
                        }}
                        onKeyDown={(e)=>{
                            if (e.key === "Enter") {
                                searchOrder(searchQuery)
                            }
                        }}
                        className="
                        input
                        input-bordered
                        w-full
                        bg-[#081223]
                        border-blue-950
                        "
                    />

                </div>


                <div className="space-y-5">

                    {
                        orders.map(order => (
                            <AdminOrderCard
                                email={order.email}
                                key={order._id}
                                status={order.status}
                                orderDate={new Date(order.createdAt).toLocaleDateString()}
                                orderId={order._id}
                                address={order.address}
                                fetchOrders={fetchOrders}
                            />
                        ))
                    }

                </div>

            </div>

        </div>
    );
};

export default AdminOrder