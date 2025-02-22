import React, { useState, useEffect } from 'react';

const AdsScroller = () => {
    const images = [
        "/images/1.png",
        "/images/2.png",
        "/images/3.png",
      ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className='h-30 mr-8 rounded-lg flex flex-wrap shadow-md overflow-hidden sm:mt-6'>
      <img src={images[currentIndex]} alt={`Banner ${currentIndex + 1}`} className=""
      />
    </div>
  );
};

export default AdsScroller;
