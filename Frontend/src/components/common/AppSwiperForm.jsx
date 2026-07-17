


import React, {useEffect, useState} from "react";
import { toast } from "react-hot-toast";
import api from "../../config/api.js";

const AppSwiperForm = () => {
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (e) => {
        e.preventDefault();
        const files = Array.from(e.target.files);


        if (files.length > 5) {
            toast.error("You can only upload a maximum of 5 imagery assets.");
            return;
        }

        setImages(files);


        const visualPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(visualPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) {
            toast.error("Please drop or choose target image assets first.");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();


        images.forEach((image) => {
            formData.append("swiper", image);
        });

        try {

            const response = await api.put(
                `/appswiper`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true
                }
            );

            toast.success("E-commerce swiper deck published successfully!");
            setImages(response.data?.data?.images);
            setPreviewUrls(response.data?.data?.images);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "An exception occurred while modifying carousel values.");
        } finally {
            setIsUploading(false);
        }
    };
    useEffect(() => {
        return () => {
            previewUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);
    return (
        <div className="min-h-screen bg-gradient-to-r from-[#071326] via-black to-[#071326] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-3xl bg-[#081223] border border-blue-950 rounded-3xl p-8 shadow-2xl backdrop-blur-md">


                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">
                        App Swiper Controls
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Modify, scale, and publish the promotional graphics visible on the customer store homepage.
                    </p>
                </div>


                <div className="border-2 border-dashed border-blue-950/60 hover:border-blue-700/80 bg-[#0b172d]/40 rounded-2xl p-10 text-center cursor-pointer relative transition-all duration-300 group">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        id="swiper-images"
                        onChange={handleChange}
                    />

                    <div className="space-y-3 pointer-events-none">

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="mx-auto w-10 h-10 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>

                        <div>
                            <p className="text-lg font-semibold text-slate-200">
                                Click or drag files to sync images
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                High-definition widescreen formats accepted (Max 5 items)
                            </p>
                        </div>
                    </div>
                </div>


                {previewUrls.length > 0 && (
                    <div className="mt-8 bg-[#060d1a] border border-blue-950/80 p-4 rounded-xl">
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-3">
                            Staging Asset Queue ({previewUrls.length}/5)
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {previewUrls.map((url, i) => (
                                <div
                                    className="relative aspect-video rounded-lg overflow-hidden border border-blue-900/40 bg-slate-900/50 group"
                                    key={`${url}-${i}`}
                                >
                                    <img
                                        src={url}
                                        alt={`Preview Frame ${i}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-[10px] text-white bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700 truncate max-w-[90%]">
                                            {images[i]?.name}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                <button
                    type="submit"
                    disabled={isUploading}
                    className={`w-full mt-8 btn btn-primary text-sm font-bold tracking-wide transition-all duration-300 rounded-xl h-12 ${
                        isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={handleSubmit}
                >
                    {isUploading ? (
                        <span className="loading loading-spinner loading-sm">Publishing to CDN...</span>
                    ) : (
                        "Save and Sync Swiper Deck"
                    )}
                </button>

            </div>
        </div>
    );
};

export default AppSwiperForm