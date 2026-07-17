import React from "react";
import {useSelector} from "react-redux";
import {Rating} from "./Rating.jsx";

export const Review = ({productId}) => {
    const reviews = useSelector((state)=>state.reviews.myReviews[productId]);

    return (
        <div className="bg-[#0b172a] border border-blue-950/60 rounded-2xl p-5 hover:border-blue-900/60 transition-all duration-300 shadow-xl shadow-black/10">


            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">


                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-blue-900/50 bg-[#081223] shrink-0">
                        <img
                            loading="lazy"
                            src={reviews?.user?.avatar || "/placeholder-avatar.png"}
                            alt={reviews?.user?.email || "User"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-200 tracking-wide truncate max-w-[200px] sm:max-w-xs">
                            {reviews?.user?.email?.split("@")[0] || "Anonymous"}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-[#38bdf8] font-medium text-xs tracking-wider uppercase">
                                Verified Buyer
                            </p>
                        </div>
                    </div>
                </div>


                <div className="flex items-center gap-0.5 bg-[#081223] px-3 py-1.5 rounded-xl border border-blue-950/40 w-fit">
                    <Rating
                        currentRating={reviews?.rating}
                        readOnly
                        name={`my-review-${productId}`}
                    />
                </div>

            </div>


            <p className="text-slate-300 text-sm leading-relaxed mb-4 font-normal">
                {reviews?.description}
            </p>


            {reviews?.images && reviews?.images.length > 0 && (
                <div className="mt-4 pt-1">
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {reviews?.images?.map((imgUrl, idx) => (
                            <div
                                key={`${imgUrl}-${idx}`}
                                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-blue-950/80 bg-[#081223] shrink-0 group aspect-square shadow-md hover:border-indigo-500/50 transition-all duration-300 cursor-pointer"
                            >
                                <img
                                    loading="lazy"
                                    src={imgUrl}
                                    alt={`Product user attachment ${idx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};