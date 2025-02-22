import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import "swiper/css";

const BlogCard = ({ images = [], countryDetail }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const CustomNextArrow = () => {
    const swiper = useSwiper();
    return (
      <button className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all" onClick={() => swiper.slideNext()} >
        <FaArrowRight className="text-lg" />
      </button>
    );
  };
  
  const CustomPrevArrow = () => {
    const swiper = useSwiper();
    return (
      <button className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-all" onClick={() => swiper.slidePrev()} >
        <FaArrowLeft className="text-lg" />
      </button>
    );
  };

  const faqItems = [
    {
      question: "History",
      answer: countryDetail.cities[0].textual.history[0],
    },
    {
      question: "Currency",
      answer: countryDetail.cities[0].textual.currency[0],
    },
    {
      question: "Climate",
      answer: countryDetail.cities[0].textual.climate[0],
    },
    {
      question: "Cuisine",
      answer: countryDetail.cities[0].textual.cuisine[0],
    },
  ];

  return (
    <>
      <div id="topic-box" className="h-full px-6 -mt-32 relative rounded-t-[35px] bg-gray-50 shadow-md overflow-hidden" >
        <div className="flex flex-row">
          <div id="photo" className="w-1/4 my-12 ml-12">
            {images.length > 0 ? (
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                className="rounded-lg shadow-md"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-[450px] object-cover rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="text-center text-gray-500">No images available</p>
            )}

            {/* <iframe src={countryDetail.map} className='w-full h-[450px] shadow-md rounded-lg' allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe> */}
          </div>
          <div className="w-3/4 ml-12 my-12">
            <h2 className="font-poppins font-semibold text-2xl text-black">
              Local Guides
            </h2>
            <p className="mt-4 text-base text-gray-700 leading-relaxed mr-14">
              {countryDetail.blog_content}
            </p>

            {/* Other Section */}
            <div className="mt-8 mr-14">
              <div className="space-y-2" id="accordionExample">
                {faqItems.map((item, index) => (
                  <div
                    key={index}
                    className="faq-item bg-gray-100 bg-opacity-20 shadow rounded-lg"
                  >
                    <div
                      className="faq-header py-3 px-4 cursor-pointer flex justify-between items-center"
                      id={`heading${index}`}
                      onClick={() => toggleFaq(index)}
                    >
                      <h5 className="text-sm font-poppins font-semibold text-gray-800">
                        {item.question}
                      </h5>
                      <span
                        className={`transform transition-transform duration-700 ease-in-out ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                      >
                        <i className="fa-solid fa-caret-down"></i>
                      </span>
                    </div>
                    <div
                      id={`collapse${index}`}
                      className={`faq-content overflow-hidden transition-all duration-700 ease-in-out ${
                        openIndex === index
                          ? "max-h-[500px] opacity-100 translate-y-0 scale-100"
                          : "max-h-0 opacity-0 -translate-y-2 scale-95"
                      }`}
                      style={{
                        transitionProperty: "max-height, opacity, transform", // Include transform for scale and slide effects
                      }}
                    >
                      <div className="p-4 border-t border-gray-200 text-gray-700">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div class="h-44 my-12 flex flex-row w-full bg-slate-100 rounded-lg">
          <div className="w-1/3 text-center flex flex-row items-center justify-center">
            <img src="../images/adventurer.png" alt="we're here" className="w-24 h-24 mr-5" />
            <div className="text-left">
              <p className="font-poppins text-lg font-semibold">
                Explore Top Destinations
              </p>
              <p className="text-xs font-light">
                Hidden gems, and guided exploration.
              </p>
            </div>
          </div>
          <div className="w-1/3 text-center flex flex-row items-center justify-center">
            <img
              src="../images/hobby.png"
              alt="we're here"
              className="w-24 h-24 mr-5"
            />
            <div className="text-left">
              <p className="font-poppins text-lg font-semibold">
                
                Local Insights
              </p>
              <p className="text-xs font-light">
                
                Expert-recommended local experiences.
              </p>
            </div>
          </div>
          <div className="w-1/3 text-center flex flex-row items-center justify-center">
            <img src="../images/tourist.png" alt="we're here" className="w-24 h-24 mr-5" />
            <div className="text-left">
              <p className="font-poppins text-lg font-semibold">
                
                Breathtaking Moments
              </p>
              <p className="text-xs font-light">
                
                Stunning visuals, amazing destinations.
              </p>
            </div>
          </div>
        </div>

        <p className="font-semibold font-poppins text-2xl mx-12">
          Things to do in {countryDetail.country_name}
        </p>

        <div className="what-section flex flex-col mx-12 mt-12 mb-16 space-y-7">
          <div className="w-full h-80 space-x-5 flex flex-row">
            <div className="w-1/4 shadow-md rounded-lg flex flex-col justify-between p-6 relative"
              style={{
                background: `url(../images/do2.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center", }} >
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg pointer-events-none"></div>

              <div className="relative z-10 text-white">
                <h2 className="text-xl font-bold font-poppins mb-4"> What To Do </h2>
                <p className="text-sm font-poppins mt-5">
                  Discover the most popular places to stay in
                  {countryDetail.country_name}, complete with recommendations
                  and special hotel offers
                </p>
              </div>

              <button className="mt-4 z-10 bg-white text-indigo-700 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-100">
                View More
              </button>
            </div>

            <div className="w-3/4 h-full bg-transparent relative">
              <Swiper
                spaceBetween={20}
                slidesPerView={3}
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => console.log(swiper)}
              >
                <CustomPrevArrow />
                <CustomNextArrow />

                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 1</h3>
                    <p>Content for card 1</p>
                  </div>
                </SwiperSlide>


                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 2</h3>
                    <p>Content for card 2</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 3</h3>
                    <p>Content for card 3</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 4</h3>
                    <p>Content for card 4</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 5</h3>
                    <p>Content for card 5</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 6</h3>
                    <p>Content for card 6</p>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
          <div className="w-full h-80 space-x-5 flex flex-row">
            <div
              className="w-1/4 shadow-md rounded-lg flex flex-col justify-between p-6 relative"
              style={{
                background: `url(../images/stay.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg pointer-events-none"></div>

              <div className="relative z-10 text-white">
                <h2 className="text-xl font-bold font-poppins mb-4">
                  Where to Stay
                </h2>
                <p className="text-sm font-poppins mt-5">
                  Discover the most popular places to stay in
                  {countryDetail.country_name}, complete with recommendations
                  and special hotel offers
                </p>
              </div>

              <button className="mt-4 z-10 bg-white text-indigo-700 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-100">
                View More
              </button>
            </div>
            <div className="w-3/4 h-full bg-transparent relative">
              <Swiper
                spaceBetween={20}
                slidesPerView={3}
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => console.log(swiper)}
              >          
                <CustomPrevArrow />
                <CustomNextArrow />

                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 1</h3>
                    <p>Content for card 1</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 2</h3>
                    <p>Content for card 2</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 3</h3>
                    <p>Content for card 3</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 4</h3>
                    <p>Content for card 4</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 5</h3>
                    <p>Content for card 5</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 6</h3>
                    <p>Content for card 6</p>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>          
          </div>
          <div className="w-full h-80 space-x-5 flex flex-row">
            <div
              className="w-1/4  shadow-md rounded-lg flex flex-col justify-between p-6 relative"
              style={{
                background: `url(../images/eat2.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg pointer-events-none"></div>

              <div className="relative z-10 text-white">
                <h2 className="text-xl font-bold font-poppins mb-4">
                  What to Eat
                </h2>
                <p className="text-sm font-poppins mt-5">
                  Want to eat like a local? Don't miss out on these
                  {countryDetail.country_name} dishes and foodie spots.
                </p>
              </div>

              <button className="mt-4 z-10 bg-white text-indigo-700 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-100">
                View More
              </button>
            </div>
            <div className="w-3/4 h-full bg-transparent relative">
              <Swiper
                spaceBetween={20}
                slidesPerView={3}
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => console.log(swiper)}
              >             
                <CustomPrevArrow />
                <CustomNextArrow />

                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 1</h3>
                    <p>Content for card 1</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 2</h3>
                    <p>Content for card 2</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 3</h3>
                    <p>Content for card 3</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 4</h3>
                    <p>Content for card 4</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 5</h3>
                    <p>Content for card 5</p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="bg-white h-80 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold">Card 6</h3>
                    <p>Content for card 6</p>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogCard;
