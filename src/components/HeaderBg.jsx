import React, { useState, useEffect } from 'react';

const HeaderBg = ({ title, images = [], flag = true, bgColor, height = '300px', style = "text-5xl font-extrabold  md:text-5xl" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5500); // Change image every 5 seconds

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [images]);

  const bg = images.length > 0 ? images[currentImageIndex] : '../images/car-rental-bg.webp';

  return (
    <section id="header-bg" className="relative bg-cover bg-center" style={{ backgroundImage: `url(${bg})`, height: `${height}` }}>
      <div id='top' className={`absolute inset-0 ${bgColor}`}></div>

      <div className="w-full max-w-[1150px] h-full flex items-center -mt-12 lg:ml-16 md:ml-7 sm:ml-9 relative">
        <div className="w-full flex flex-row justify-between items-center">
          <div className={`${style} text-white  font-poppins`}>
            {title}
          </div>

          {flag && 
            <div id='buttons' className="flex flex-wrap items-center gap-2 ml-auto">
              <button className="cursor-pointer bg-[#31e0ff] bg-opacity-35 relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3 hover:-translate-y-0.5" >
                <i className="fa-duotone fa-regular fa-island-tropical text-[#31e0ff]"></i>
                <span className="text-white">Attractions</span>
              </button>
              <button className="cursor-pointer bg-[#60A5FA] bg-opacity-40 relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-6 hover:-translate-y-0.5" >
                <i className="fa-duotone fa-regular fa-hotel text-sky-300"></i>
                <span className="text-white">Stay</span>
              </button>
              <button className="cursor-pointer bg-yellow-200 bg-opacity-40 relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-6 hover:-translate-y-0.5" >
                <i className="fa-duotone fa-regular fa-utensils text-yellow-400"></i>
                <span className="text-white">Restaurants</span>
              </button>
              <button className="cursor-pointer bg-[#FB923C] bg-opacity-40 relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-6 hover:-translate-y-0.5" >
                <i className="fa-duotone fa-solid fa-images text-orange-200"></i>
                <span className="text-white">Moments</span>
              </button>
              <button className="cursor-pointer bg-red-400 bg-opacity-40 relative inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-6 hover:-translate-y-0.5" >
                <i className="fa-duotone fa-regular fa-message-question text-pink-300"></i>
                <span className="text-white">FAQs</span>
              </button>
            </div>
          }
        </div>
      </div>
    </section>
  );
};

export default HeaderBg;