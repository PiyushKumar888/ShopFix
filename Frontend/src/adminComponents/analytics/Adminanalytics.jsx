import { RevenueChart } from "./RevenueChart.jsx";
import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import {PageLoader} from "../../components/loaders/PageLoader.jsx";
import api from "../../config/api.js";

const Adminanalytics = () => {
    const [loading, setLoading] = useState(false);
    const[analytics, setAnalytics] = useState([]);
    const[monthlyAnalytics, setMonthlyAnalytics] = useState([]);
    const getAnalytics = async () => {
        try{

            const response =  await api
                .get(`/analytics`)

            setAnalytics((response.data.data));
        }catch(err){
            console.log("Error: "+err.message);

        }
    }
    const getmonthlyAnalytics = async () => {
        try{
            const response =  await api
                .get(`/analytics/montly-analytics`)

            setMonthlyAnalytics((response.data.data));
        }catch(err){
            console.log("Error: "+err.message);

        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try{
                setLoading(true);
               await Promise.all([
                    getAnalytics(),
                    getmonthlyAnalytics()
                ])
            }catch(err){
                console.log("Error: "+err.message);
            }finally{
                setLoading(false);
            }
        }
        fetchData();


    },[])

    if (loading) {
        return (
            <PageLoader/>
        )
    }
    return (
        <div className="min-h-screen bg-gradient-to-r from-[#071326] via-black to-[#071326] text-white">

            <div className="max-w-7xl mx-auto px-6 py-10">



                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">

                    <div>
                        <h1 className="text-4xl font-bold">
                            Admin Dashboard
                        </h1>

                        <p className="text-gray-400 mt-2">
                            Monitor revenue, orders and platform activity.
                        </p>
                    </div>

                </div>




                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

                    <Link
                        to="/admin/products"
                        className="
                        bg-[#081223]
                        border border-blue-950
                        rounded-2xl
                        p-6
                        hover:border-blue-700
                        transition-all
                        "
                    >
                        <h3 className="text-lg font-semibold">
                            Products
                        </h3>

                        <p className="text-gray-400 mt-2">
                            Manage catalog and inventory
                        </p>
                    </Link>


                    <Link
                        to="/admin/orders"
                        className="
                        bg-[#081223]
                        border border-blue-950
                        rounded-2xl
                        p-6
                        hover:border-blue-700
                        transition-all
                        "
                    >
                        <h3 className="text-lg font-semibold">
                            Orders
                        </h3>

                        <p className="text-gray-400 mt-2">
                            Track and update orders
                        </p>
                    </Link>


                    <Link
                        to="/admin/users"
                        className="
                        bg-[#081223]
                        border border-blue-950
                        rounded-2xl
                        p-6
                        hover:border-blue-700
                        transition-all
                        "
                    >
                        <h3 className="text-lg font-semibold">
                            Users
                        </h3>

                        <p className="text-gray-400 mt-2">
                            Manage platform users
                        </p>
                    </Link>

                </div>




                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

                    <div className="
                    bg-[#081223]
                    border
                    border-green-900
                    rounded-2xl
                    p-6
                    ">
                        <p className="text-gray-400 text-sm">
                            Total Revenue
                        </p>

                        <h2 className="text-3xl font-bold text-green-400 mt-2">
                            ₹{analytics?.[0]?.totalRevenue || 0}
                        </h2>
                    </div>


                    <div className="
                    bg-[#081223]
                    border
                    border-blue-900
                    rounded-2xl
                    p-6
                    ">
                        <p className="text-gray-400 text-sm">
                            Total Orders
                        </p>

                        <h2 className="text-3xl font-bold text-blue-400 mt-2">
                            {analytics?.[0]?.totalOrders || 0}
                        </h2>
                    </div>


                    <div className="
                    bg-[#081223]
                    border
                    border-purple-900
                    rounded-2xl
                    p-6
                    ">
                        <p className="text-gray-400 text-sm">
                            Average Revenue
                        </p>

                        <h2 className="text-3xl font-bold text-purple-400 mt-2">
                            ₹{Math.round(analytics?.[0]?.averageRevenue || 0)}

                        </h2>
                    </div>

                </div>




                <div
                    className="
                    bg-[#081223]
                    border
                    border-blue-950
                    rounded-3xl
                    p-8
                    "
                >
                    <div className="mb-6">

                        <h2 className="text-2xl font-semibold">
                            Monthly Revenue Analytics
                        </h2>

                        <p className="text-gray-400 mt-2">
                            Revenue and order trends across months.
                        </p>

                    </div>

                    <RevenueChart
                        data={monthlyAnalytics}
                    />

                </div>

            </div>

        </div>
    );
};

export default  Adminanalytics