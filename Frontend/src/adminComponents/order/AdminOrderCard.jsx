import {toast} from "react-hot-toast";
import {useState} from "react";
import api from "../../config/api.js";



export const AdminOrderCard = ({
                                   orderId,
                                   email,
                                   orderDate,
                                   status = "Pending",
                                   address: { street, city, state, postalCode } = {},
                                   fetchOrders
                               }) => {
    const[loading, setLoading] = useState(false);
    const updateStatus = async (status) => {
        try{
            setLoading(true);
            const response = await api
                .put(`/order/${orderId}/${status}`)
            toast.success("Successfully updated order status")
            return true
        }catch(err){
            console.log(err)
            toast.error("Failed to update order status")
            return false

        }finally{
            setLoading(false);
        }
    }
    const updateStatusHandler =async (status) =>{
        const success =await  updateStatus(status)
            if (success){
                fetchOrders()
            }
     }

    return (
        <div
            className="
            w-full
            bg-[#081223]
            border
            border-blue-950
            rounded-2xl
            p-6
            hover:border-blue-800
            transition-all
            duration-300
            "
        >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">


                <div className="space-y-2">

                    <h3 className="text-lg font-semibold text-white">
                        Order #{orderId}
                    </h3>

                    <p className="text-sm text-gray-400">
                        {email}
                    </p>

                    <p className="text-sm text-gray-500">
                        {orderDate}
                    </p>


                    <div className="text-sm text-gray-400 pt-1 border-t border-blue-950/40">
                        <p className="font-medium text-gray-300">Shipping Address:</p>
                        <p>{street}</p>
                        <p>{city}, {state} - {postalCode}</p>
                    </div>

                </div>


                <div className="flex flex-col gap-2 min-w-[180px]">

                    <label className="text-sm text-gray-400">
                        Order Status
                    </label>

                    <select
                        disabled={loading}
                        defaultValue={status}
                        onChange={(e) => {
                            updateStatusHandler(e.target.value);

                        }}
                        className="
                        select
                        select-bordered
                        bg-[#071326]
                        border-blue-900
                        text-white
                        w-full
                        "
                    >
                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Shipped">
                            Shipped
                        </option>

                        <option value="Delivered">
                            Delivered
                        </option>

                        <option value="Cancelled">
                            Cancelled
                        </option>
                    </select>



                </div>

            </div>
        </div>
    );
};