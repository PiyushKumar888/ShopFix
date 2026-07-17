import {useEffect, useState} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { ImageOff } from "lucide-react";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import {PageLoader} from "../loaders/PageLoader.jsx";
import api from "../../config/api.js";


export const AppSwiper = () => {

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(()=>{
        const AppSwiperImages = async () =>{
            try{
                setLoading(true);
                const response = await api
                    .get(`/appswiper`)


                setImages(response.data.data?.images)
            }catch(error){
                console.log(error);

            }finally{
                setLoading(false);
            }

        }
        AppSwiperImages();
    },[])



    if (!images || images.length === 0) {
        return (
            <div className="w-full flex flex-col gap-3 items-center justify-center rounded-3xl bg-base-200 border border-base-300 h-[280px] sm:h-[360px] md:h-[450px] lg:h-[520px]">
                <ImageOff className="w-10 h-10 opacity-40" />
                <p className="text-sm font-medium opacity-50">
                    No promotional banners available
                </p>
            </div>
        );
    }
    if (loading) {
        return (
            <PageLoader/>
        )
    }

    return (
        <div className="relative isolate z-0 w-full max-w-[1600px] mx-auto px-4 py-6">

            <Swiper
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false
                }}
                loop={images.length > 1}
                modules={[Navigation, Pagination, Autoplay]}
                className="rounded-3xl overflow-hidden shadow-2xl border border-base-300 aspect-[16/6] max-h-[520px]"
            >
                {images?.map((url, index) => (
                    <SwiperSlide key={`${url}-${index}`}>
                        <div className="relative w-full h-full">

                            <img
                                src={url}
                                alt={`Banner ${index + 1}`}
                                loading={index === 0 ? "eager" : "lazy"}
                                className="w-full h-full object-cover object-top md:object-center select-none"
                            />


                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/20" />

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>
    );
};