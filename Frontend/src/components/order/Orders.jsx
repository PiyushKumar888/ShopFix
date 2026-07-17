import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import ReviewForm from "../Review/ReviewForm.jsx";
import {Review} from "../Review/Review.jsx";
import {toast} from "react-hot-toast";
import {setMyReviews} from "../../features/reviews/reviewsSlice.js";
import {Spinner} from "../loaders/Spinner.jsx";
import api from "../../config/api.js";


export const Orders = ({name,images,quantity,totalprice,createdAt,deliveredAt=null,status,productId}) => {


    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const onClose = () => {
        setIsOpen(false);

    }
    const onOpen = () => {
        setIsOpen(true);
    }
    const fetchUserReviews = async () => {
        try{
            setLoading(true);
            const response = await api
                .get(`/review/${productId}`)
            if (response.data.data){
                dispatch(setMyReviews(response.data.data));
            }else{
                dispatch(setMyReviews({deleteId:productId}));
            }

        }catch(err){
            console.log(err);

        }finally{
            setLoading(false);
        }
    }
    useEffect(() => {
        if (status === "Delivered") {
            fetchUserReviews();
        }

    },[productId,status,dispatch])
    const reviews = useSelector((state)=>state.reviews.myReviews[productId]);
    const isReview = Boolean(reviews)

    return (
        <>
            <div className="bg-[#081223] border border-blue-950 rounded-2xl p-5 hover:border-blue-800 transition-all duration-300">

                <div className="flex flex-col sm:flex-row gap-5">


                    <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl">

                        <img
                            loading="lazy"
                            src={images}
                            alt={name}
                            className="w-full h-full object-cover"
                        />

                    </div>


                    <div className="flex-1 min-w-0">

                        <div className="flex items-start justify-between">

                            <h2 className="text-lg font-semibold text-white">
                                {name}
                            </h2>

                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                                    status === "Delivered"
                                        ? "bg-green-900 text-green-300"
                                        : status === "Cancelled"
                                            ? "bg-red-900 text-red-300"
                                            : "bg-yellow-900 text-yellow-300"
                                }`}
                            >
                    {status}
                </span>

                        </div>

                        <div className="mt-4 space-y-2 text-gray-400">

                            <p>
                                Quantity:
                                <span className="text-white ml-2">
                        {quantity}
                    </span>
                            </p>

                            <p>
                                Total Price:
                                <span className="text-white ml-2">
                        ₹{totalprice}
                    </span>
                            </p>

                            <p>
                                Ordered On:
                                <span className="text-white ml-2">
                        {new Date(createdAt).toLocaleDateString()}
                    </span>
                            </p>

                            {
                                status === "Delivered" && (
                                    <div className="mt-4 pt-4 border-t border-blue-950/40">
                                        <div className="flex items-center gap-2 px-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                                                Delivered On:{" "}
                                                <span className="text-emerald-400 font-semibold ml-1 normal-case tracking-normal">
                                                {deliveredAt ? new Date(deliveredAt).toLocaleDateString("en-IN", {
                                                    year: "numeric", month: "long", day: "numeric",
                                                }) : "Recently"}
                                            </span>
                                            </p>
                                        </div>
                                        {isReview ? (
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center px-1">
                                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Review</span>


                                                    <div className="flex items-center gap-3">

                                                        <button
                                                            onClick={onOpen}
                                                            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                                                        >
                                                            Edit Review
                                                        </button>

                                                        <span className="text-blue-950/60 text-xs">|</span>


                                                        <button
                                                            disabled={loading}
                                                            onClick={async () => {
                                                                if (window.confirm("Are you sure you want to delete your review?")) {
                                                                    try {
                                                                        // Hit your backend delete endpoint (passing productId as a parameter or body)
                                                                        await axios.delete(`${import.meta.env.VITE_BACKEND_LINK}/review/${productId}`, {
                                                                            withCredentials: true,
                                                                        });

                                                                        toast.success("Review deleted successfully!");
                                                                        dispatch(setMyReviews({deleteId:productId}));
                                                                    } catch (err) {
                                                                        console.log(err);
                                                                        toast.error("Failed to delete review. Please try again.");
                                                                    }
                                                                }
                                                            }}
                                                            className="text-xs font-medium text-red-400 hover:text-red-300 hover:underline cursor-pointer"
                                                        >
                                                            {
                                                                loading?(
                                                                    <Spinner className="w-5 h-5" />
                                                                ):(
                                                                    "Delete"
                                                                )
                                                            }
                                                        </button>
                                                    </div>

                                                </div>


                                                <Review productId={productId} />
                                            </div>
                                        ):(

                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-[#1e293b]/20 border border-emerald-500/10 backdrop-blur-xs">


                                                <button
                                                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold tracking-wide text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-500 active:scale-98 transition-all duration-200 cursor-pointer group"
                                                    onClick={onOpen}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-200 group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.253.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.77-.557-.371-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                    </svg>
                                                    Add Review
                                                </button>
                                            </div>
                                        )}

                                    </div>
                                )}



                        </div>

                    </div>

                </div>

            </div>

            {isOpen && <ReviewForm onClose={onClose} isOpen={isOpen} productId={productId} isReview={isReview} onReviewSuccess={fetchUserReviews} />}
        </>
    )
}