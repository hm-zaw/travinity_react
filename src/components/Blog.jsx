import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import "swiper/css";
import 'swiper/css/autoplay';

const Blog = ({ images = [], countryDetail }) => {
  

  return (
    <>
      <div id="topic-box" className="h-72 mx-16 -mt-[139px] relative rounded-xl shadow-md overflow-hidden" >
        <div className="flex flex-row h-full">
            <div className="w-2/3 bg-sky-200">
                {images.length > 0 ? (
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{
                        delay: 5000, 
                        disableOnInteraction: false,
                        }}
                        modules={[Autoplay]}
                    >
                    {images.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover object-center"
          />
                        </SwiperSlide>
                    ))}
                    </Swiper>
                ) : (
                    <p className="text-center text-gray-500">No images available</p>
                )}
            </div>
            <div className="w-1/3 bg-emerald-200">
                <iframe src={countryDetail.map} className='w-full h-full shadow-md rounded-lg' allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
