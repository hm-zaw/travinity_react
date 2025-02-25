import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import p1 from "/recommended/offers01.png";
import p2 from "/recommended/offers02.png";
import p3 from "/recommended/offers03.png";
import p4 from "/recommended/offers04.webp";
import p5 from "/recommended/offers05.webp";
import p6 from "/recommended/offers06.jpg";
import p7 from "/recommended/offers07.jpg";
import p8 from "/recommended/offers08.webp";
import p9 from "/recommended/offers09.jpg";
import p10 from "/recommended/offers10.jpg";
import p11 from "/recommended/offers11.jpg";
import p12 from "/recommended/offers12.webp";

const AnimatedButton = styled(motion.button)`
  background-color: ${({ color }) => color};
  color: white;
  padding: 10px 40px;
  margin: 5px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor};
  }

  &.active,
  &:focus {
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.2);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 300px; /* Increased height for a longer image */
  object-fit: cover;
  border-radius: 12px;
`;

const recommendedCards = [
  { imgSrc: p1, tagBg: "bg-yellow-500", ratingBg: "bg-yellow-500", title: "The Montcalm At Brewery London City", location: "Westminster Borough, London", rating: 4.8, reviews: 3014, price: 72, type: 'Hotels' },
  { imgSrc: p2, tagBg: "bg-blue-500", ratingBg: "bg-blue-500", title: "Flying Over Bali", location: "Beautiful Lands, Indonesia", rating: 4.7, reviews: 4114, price: 89, type: 'Flight' },
  { imgSrc: p3, tagBg: "bg-green-500", ratingBg: "bg-green-500", title: "American Landscapes", location: "Pestminster Worough, USA", rating: 4.9, reviews: 3894, price: 88, type: 'Rental' },
  { imgSrc: p4, tagBg: "bg-yellow-500", ratingBg: "bg-yellow-500", title: "Luxurious Suites", location: "Paris, France", rating: 4.6, reviews: 2500, price: 100, type: 'Hotels' },
  { imgSrc: p5, tagBg: "bg-blue-500", ratingBg: "bg-blue-500", title: "Sunny Skies Airlines", location: "Toronto, Canada", rating: 4.5, reviews: 3700, price: 75, type: 'Flight' },
  { imgSrc: p6, tagBg: "bg-green-500", ratingBg: "bg-green-500", title: "Modern Apartments", location: "Rome, Italy", rating: 4.7, reviews: 1830, price: 95, type: 'Rental' },
  { imgSrc: p7, tagBg: "bg-yellow-500", ratingBg: "bg-yellow-500", title: "Cozy Inns", location: "Tokyo, Japan", rating: 4.4, reviews: 2990, price: 60, type: 'Hotels' },
  { imgSrc: p8, tagBg: "bg-blue-500", ratingBg: "bg-blue-500", title: "Majestic Mountains", location: "Rocky Range, Canada", rating: 4.9, reviews: 2750, price: 120, type: 'Flight' },
  { imgSrc: p9, tagBg: "bg-green-500", ratingBg: "bg-green-500", title: "Historic Homes", location: "Vienna, Austria", rating: 4.8, reviews: 2210, price: 110, type: 'Rental' },
  { imgSrc: p10, tagBg: "bg-yellow-500", ratingBg: "bg-yellow-500", title: "Tropical Retreats", location: "Phuket, Thailand", rating: 4.7, reviews: 1984, price: 105, type: 'Hotels' },
  { imgSrc: p11, tagBg: "bg-blue-500", ratingBg: "bg-blue-500", title: "Desert Dunes Lodge", location: "Sahara, Morocco", rating: 4.8, reviews: 2450, price: 130, type: 'Flight' },
  { imgSrc: p12, tagBg: "bg-green-500", ratingBg: "bg-green-500", title: "Mystic Waterfalls", location: "Victoria Falls, Zimbabwe", rating: 4.9, reviews: 1800, price: 140, type: 'Rental' }
];


function RecommendedSection() {
  const [activeSection, setActiveSection] = useState("Hotels");

  const visibleCards = recommendedCards.filter((card) => card.type === activeSection);

  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05 },
  };

  return (
    <section className="recommended py-6" id="deals">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
            <h4 className="text-3xl font-bold text-blue-600 mb-0">Recommended</h4>
            <p className="mb-0 text-green-600">International & Domestic fames ac ante ipsum</p>
          </div>
          <div className="w-full lg:w-1/2 flex items-center justify-end">
            <AnimatedButton
                variants={buttonVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className={`${
                  activeSection === "Hotels" ? "bg-blue-600" : "bg-blue-400"
                } text-white font-semibold py-2 px-4 mx-2 rounded-lg shadow-lg transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300`}
                onClick={() => setActiveSection("Hotels")}
                >
              Hotels
            </AnimatedButton>

            <AnimatedButton
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className={`${
                activeSection === "Flight" ? "bg-blue-600" : "bg-blue-400"
              } text-white font-semibold py-2 px-8 mx-2 rounded-lg shadow-lg transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300`}
              onClick={() => setActiveSection("Flight")}
            >
              Flights
            </AnimatedButton>

            <AnimatedButton
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className={`${
                activeSection === "Rental" ? "bg-blue-600" : "bg-blue-400"
              } text-white font-semibold py-2 px-4 mx-2 rounded-lg shadow-lg transition-all duration-300 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300`}
              onClick={() => setActiveSection("Rental")}
            >
    Rentals
            </AnimatedButton>

          </div>
        </div>
        <div className="flex flex-wrap mt-8">
          {visibleCards.map((item) => (
            <motion.div
              key={item.title}
              className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-8"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <div className="card-wrap p-4 bg-white rounded-lg transition duration-500 ease-in-out transform">
                <div className="con-img-wrap mx-auto relative">
                  <CardImage src={item.imgSrc} alt="product picture" />
                  <div className={`offer-tag ${item.tagBg} text-white pt-4 px-2 rounded-lg`}>
                    Best Deal
                  </div>
                  <span className="wishlist-tag absolute top-2 right-2">
                    <i className="bi bi-heart text-red-500"></i>
                  </span>
                </div>
                <div className="con-wrap mt-4 text-center">
                  <h2 className="text-lg font-bold truncate">{item.title}</h2>
                  <p className="text-green-600 mb-2 text-sm">{item.location}</p>
                  <div className="flex justify-center items-center mb-2">
                    <span className={`rating-cover py-1 px-2 rounded-lg text-white ${item.ratingBg} mr-2`}>
                      {item.rating.toFixed(1)}
                    </span>
                    <span className="text-blue-500 mr-2 text-sm">Exceptional</span>
                    <span className="text-sm">{item.reviews} reviews</span>
                  </div>
                  <p className="text-yellow-600 mb-0">Starting from US${item.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecommendedSection;