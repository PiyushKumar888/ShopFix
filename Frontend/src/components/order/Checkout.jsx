import { useForm } from "react-hook-form";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {toast} from "react-hot-toast";
import {Spinner} from "../loaders/Spinner.jsx";
import api from "../../config/api.js";






const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const[totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (location.state?.estimatedTotal) {
            setTotalAmount(location.state?.estimatedTotal);
            sessionStorage.setItem("checkout_total",location.state?.estimatedTotal);
        }
        else{
            const estimatedTotal = sessionStorage.getItem("checkout_total");
            if (!estimatedTotal) {
                navigate("/cart")
            }
            setTotalAmount(Number(estimatedTotal));
        }
    },[navigate,location])
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };
    const { register
        , handleSubmit
        , formState: { errors } } = useForm();
    const onSubmit = async (formData)=> {
        try {
            setLoading(true);
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) {
                toast.error("Razorpay SDK failed to load. Are you online?");
                return;
            }


            const orderPayload = {
                phone: formData.phone,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    postalCode: formData.postalCode,
                }
            };


            const orderResponse = await api.post(
                `/order`,
                orderPayload
            );
            const mongoOrderId = orderResponse.data.data._id;


            const paymentResponse = await api.post(
                `/payment/createOrder`,
                { orderId: mongoOrderId }
            );

            const { razorpayOrderId, amount, currency, originalOrderId } = paymentResponse.data.data;


            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount,
                currency: currency,
                name: "ShopFix Ltd.",
                description: "Secure Order Payment Checkout",
                order_id: razorpayOrderId,


                handler: async function (response) {
                    try {

                        const verifyResponse = await api.post(
                            `/payment/verifyPayment`,
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                originalOrderId: originalOrderId
                            }
                        );

                        if (verifyResponse.status === 200) {

                            navigate("/order-success");
                        }
                    } catch (err) {
                        console.error("Verification Error:", err);
                        toast.error("Payment cleared, but verification stalled. Contact support.");
                    }
                },
                prefill: {
                    contact: formData.phone,
                },
                theme: {
                    color: "#4F46E5",
                },
            };


            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error("Checkout chain broken:", error);
            toast.error(error.response?.data?.message || "An unexpected error occurred during setup.");
        }finally {
            setLoading(false);
        }

    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="min-h-screen bg-gradient-to-r from-[#071326] via-black to-[#071326] flex items-center justify-center px-4 py-10">

                    <div className="w-full max-w-2xl bg-[#081223] border border-blue-950 rounded-3xl p-8 shadow-2xl">

                        <h1 className="text-3xl font-bold text-white mb-8">
                            Checkout
                        </h1>

                        <div className="space-y-6">


                            <div>
                                <label className="block text-gray-300 mb-2">
                                    Address
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your address"
                                    className="input input-bordered w-full bg-[#0b172d] border-blue-950 text-white"
                                    {...register("address", { required: true })}
                                />
                                {errors.address && <span>This field is required</span>}
                            </div>


                            <div>
                                <label className="block text-gray-300 mb-2">
                                    Street
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter street"
                                    className="input input-bordered w-full bg-[#0b172d] border-blue-950 text-white"
                                    {...register("street", { required: true })}
                                />
                                {errors.street && <span>This field is required</span>}
                            </div>


                            <div className="grid md:grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter city"
                                        className="input input-bordered w-full bg-[#0b172d] border-blue-950 text-white"
                                        {...register("city", { required: true })}
                                    />
                                    {errors.city && <span>This field is required</span>}
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter state"
                                        className="input input-bordered w-full bg-[#0b172d] border-blue-950 text-white"
                                        {...register("state", { required: true })}
                                    />
                                    {errors.state && <span>This field is required</span>}
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        Postal Code
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter postal code"
                                        className="input input-bordered w-full bg-[#0b172d] border-blue-950 text-white"
                                        {...register("postalCode", { required: true })}
                                    />
                                    {errors.postalCode && <span>This field is required</span>}
                                </div>

                            </div>


                            <div>
                                <label className="block text-gray-300 mb-2">
                                    Phone Number
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter phone number"
                                    className="input input-bordered w-full bg-[#0b172d] border-blue-950 text-white"
                                    {...register("phone", { required: true })}
                                />
                                {errors.phone && <span>This field is required</span>}
                            </div>


                            <div className="border-t border-blue-950 pt-6">

                                <div className="flex justify-between items-center mb-6">

                            <span className="text-lg text-gray-300">
                                Total Amount
                            </span>

                                    <span className="text-2xl font-bold text-white">
                                ₹{totalAmount}
                            </span>

                                </div>

                                <button
                                    disabled={loading}
                                    className="btn btn-primary w-full">
                                    {loading ? (
                                        <Spinner className="w-5 h-5" />
                                    ) : (
                                        "Proceed To Payment"
                                    )}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            </form>
        </>

    );
};

export default Checkout