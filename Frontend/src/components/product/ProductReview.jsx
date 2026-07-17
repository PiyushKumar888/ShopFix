import React from 'react';
import {  ThumbsUp, MessageSquare } from 'lucide-react';
import {Rating} from "../Review/Rating.jsx";

export const ProductReview = ({
                           avatar,
                           name,
                           email,
                           description,
                           images = [],
                           rating,

                       }) => {
    return (
        <div className="w-full max-w-4xl bg-[#0f1115] border border-[#1f222a] rounded-2xl p-6 text-gray-200 shadow-xl transition-all hover:border-[#2f3542]">


            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#1f222a]">
                <div className="flex items-center gap-3">

                    <img
                        loading="lazy"
                        src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                        alt={name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#2f3542]"
                    />
                    <div>
                        <h4 className="font-semibold text-white text-base leading-tight">{name || "Anonymous"}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{email}</p>
                    </div>
                </div>


                
            </div>


            <div className="mt-4">

                <div className="flex items-center gap-1 text-amber-400 mb-2">

                        <Rating
                            currentRating={rating}
                            readOnly={true}
                            name={`review-${email}`}
                        />

                    <span className="text-xs text-gray-400 ml-2 font-medium">Verified Purchase</span>
                </div>


                <p className="text-sm text-gray-300 leading-relaxed max-w-3xl mt-3">
                    {description || "No review content provided."}
                </p>
            </div>


            {images && images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                    {images.map((imgUrl, index) => (
                        <div
                            key={`${imgUrl}-${index}`}
                            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-[#2f3542] hover:border-white/40 cursor-pointer transition-all"
                        >
                            <img
                                loading="lazy"
                                src={imgUrl}
                                alt={`User upload ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    ))}
                </div>
            )}


            <div className="mt-6 pt-4 border-t border-[#1f222a] flex items-center gap-6 text-xs text-gray-400">
                <button className="flex items-center gap-1.5 hover:text-white transition-colors group cursor-pointer">
                    <ThumbsUp size={14} className="group-hover:scale-110 transition-transform"/>
                    <span>Helpful</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-white transition-colors group cursor-pointer">
                    <MessageSquare size={14} className="group-hover:scale-110 transition-transform"/>
                    <span>Comment</span>
                </button>
            </div>

        </div>
    );
};

