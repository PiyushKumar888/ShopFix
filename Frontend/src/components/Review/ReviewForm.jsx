import { useForm } from "react-hook-form";
import { Rating } from "./Rating.jsx";
import { useSelector } from "react-redux";
import {useEffect, useRef, useState} from "react";

import {toast} from "react-hot-toast";
import {Spinner} from "../loaders/Spinner.jsx";
import api from "../../config/api.js";

const ReviewForm = ({ isOpen, onClose ,productId,isReview ,onReviewSuccess }) => {
    const user = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const {  handleSubmit, formState: { errors } } = useForm();
    const dialogRef = useRef(null);
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (isOpen) {
            dialogRef?.current?.showModal();
        } else {
            dialogRef.current?.close();
        }
    }, [isOpen]);

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files.length > 5) {
            toast.error("only at max 5 images will be uploaded.");
            onClose()
            return;
        }
        if (e.target.files){
            setImages(Array.from(e.target.files));
        }


    }

    const onSubmit = (data) =>{
        const formData = new FormData();
        formData.append("productId", productId);
        formData.append("description", text);
        formData.append("rating", rating);
        images.forEach((file) => {
            formData.append("reviewImages", file);
        });
        if (!isReview) {
            const addReview =async () =>{

                try{
                    setLoading(true);
                    const response = await api
                        .post(`/review`,formData)
                    if (onReviewSuccess) onReviewSuccess()

                    toast.success("Review added successfully!");

                    onClose()
                }catch(err){
                    console.log(err)
                    toast.error("Failed to add Review. Please try again.");
                }finally{
                    setLoading(false);
                }
            }
            addReview();
        }
        else{
            const updateReview = async () =>{
                try{
                    setLoading(true);
                    const response = await api
                        .put(`/review`,formData)

                    if (onReviewSuccess) onReviewSuccess()
                    toast.success("Review updated successfully");

                    onClose()
                }catch(err){
                    console.log(err)
                    toast.error("Failed to update Review. Please try again.");
                }finally{
                    setLoading(false);
                }
            }
            updateReview();
         }


    }

    return (
        <>
            <dialog ref={dialogRef}  onClose={onClose}   className="modal backdrop:backdrop-blur-sm">


                <div className="modal-box w-11/12 max-w-2xl bg-[#081223] border border-blue-950/60 p-6 rounded-2xl relative shadow-2xl">

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-blue-950/60 transition-colors duration-150 cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <form onSubmit={handleSubmit(onSubmit)}>


                        <div className="flex items-center gap-3 mb-6 border-b border-blue-950/40 pb-4">
                            <div className="w-10 h-10 rounded-full border border-blue-800 bg-blue-900 overflow-hidden flex items-center justify-center text-white font-bold shrink-0">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white font-medium text-sm tracking-wide">
                                    {user?.name?.toUpperCase()}
                                </span>
                                <span className="text-xs text-slate-400">Public review</span>
                            </div>
                        </div>


                        <div className="mb-6 bg-[#0b172d]/40 p-4 border border-blue-950/40 rounded-xl">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Your Rating
                            </label>
                            <Rating
                                currentRating={rating}
                                setRating={setRating}
                            />
                        </div>


                        <div className="mb-4">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Your Review
                            </label>
                            <textarea
                                placeholder="Share your experience with this product... What did you like or dislike?"
                                className="textarea w-full bg-[#0b172d] border border-blue-950 focus:border-blue-700 text-slate-100 p-4 rounded-xl resize-none transition-colors duration-200 focus:outline-hidden text-base"
                                rows={5}
                                onChange={(e)=>setText(e.target.value)}
                            />
                        </div>
                        <div className="mb-4 bg-[#0b172d]/20 border border-dashed border-blue-950/80 rounded-xl p-4 transition-colors hover:border-blue-900">
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Upload Product Images</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="file-input file-input-bordered file-input-sm w-full bg-[#0b172d] text-slate-300 border-blue-950 focus:outline-hidden"
                            />
                            {images.length > 0 && (
                                <p className="text-xs text-emerald-400 mt-2 font-medium">
                                    📎 {images.length} images selected ready for cloud processing
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end items-center gap-3 mt-6 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={loading}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white hover:bg-blue-950/30 rounded-xl transition-all duration-200 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white text-sm font-bold tracking-wide rounded-xl shadow-lg shadow-blue-600/10 cursor-pointer transition-all duration-200">
                                { loading?(
                                    <div className="flex items-center justify-center">
                                        <Spinner className="w-5 h-5" />
                                    </div>
                                ): (!isReview?"Post Review":"Update Review")}
                            </button>
                        </div>

                    </form>
                </div>


                <form method="dialog" className="modal-backdrop bg-black/75">
                    <button onClick={onClose}>close</button>
                </form>
            </dialog>
        </>
    );
};

export default ReviewForm