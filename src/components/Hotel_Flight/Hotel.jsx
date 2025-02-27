import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import Header from '../Cruise/CruiseHeader';
import HeaderBg from '../HeaderBg';
import { checkPaymentHotel } from '../../api/CarService';
import Footer from '../Dashboard/Footer';
import SubscriptionSection from '../Dashboard/SubscriptionSection';

const Hotel = () => {
  const location = useLocation();
  const dataCarry = location.state;
  const [hotels, setHotels] = useState([]);
  const [dayDifference, setDayDifference] = useState(0);
  const [error, setError] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [priceCounts, setPriceCounts] = useState(0);
  const [reviewCounts, setReviewCounts] = useState(0);
  const [ratingCounts, setRatingCounts] = useState(0);

  const [filteredHotels, setFilteredHotels] = useState(hotels);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  const checkInDate = new Date().toISOString().split('T')[0];
  const checkOutDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [activeTab, setActiveTab] = useState('recommended');
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
      setSearchState(prevState => ({
        ...prevState,
        [name]: value
      }));
  };

  // hmz code
  const handleSubmitForm = async (e) => {
    if(e) e.preventDefault();
    console.log("handleSubmitForm is called");

    const checkin = new Date(searchState.checkInDate);
    const checkout = new Date(searchState.checkOutDate);
    const timeDifference = checkout - checkin;
    const dayDifference = timeDifference / (1000 * 3600 * 24);
    setDayDifference(dayDifference);

    try {
      const response = await axios.get(`http://localhost:8080/searchHotels`, {
        params: searchState
      });
      console.log(response);
      setHotels(response.data);
      setFilteredHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('Failed to fetch hotels. Please try again.');
    }
  };

  const [searchState, setSearchState] = useState({
    destination: "",
    checkInDate: checkInDate,
    checkOutDate: checkOutDate,
    rooms: 1,
    adults: 2,
    children: 0,
  });

  useEffect(() => {
    if (location.state && !hasSubmitted) {
      setSearchState({
        destination: dataCarry.destination,
        checkInDate: dataCarry.checkinDate,
        checkOutDate: dataCarry.checkoutDate,
        rooms: dataCarry.rooms,
        adults: dataCarry.adults,
        children: dataCarry.children,
      });
      setHasSubmitted(true); // Set the flag to true after submitting
    }
  }, [location.state, dataCarry, hasSubmitted]);

  useEffect(() => {
    if (hasSubmitted) {
      handleSubmitForm(); // Automatically call handleSubmitForm
    }
  }, [hasSubmitted]);

  useEffect(() => {
    console.log(searchState);
  }, [searchState]);


  const getRandomTime = () => {
    const isHours = Math.random() < 0.5; // Randomly decide between mins and hrs
    if (isHours) {
      const hours = Math.floor(Math.random() * 20) + 1; // Randomize hours between 1 and 20
      return `Last booked ${hours} hour${hours > 1 ? 's' : ''} ago on our site`;
    } else {
      const minutes = Math.floor(Math.random() * (59 - 3 + 1)) + 3; // Randomize minutes between 3 and 59
      return `Last booked ${minutes} minute${minutes > 1 ? 's' : ''} ago on our site`;
    }
  };

  // for filter data count
  const categorizeHotelsByPrice = (hotels) => {
    const priceRanges = {
      "US$50 - US$125": 0,
      "US$125 - US$250": 0,
      "US$250 - US$325": 0,
      "US$325 - US$500": 0,
      "US$500 and above": 0,
    };
  
    hotels.forEach((hotel) => {
      const price = parseFloat(hotel.gross_amount.replace("US$", ""));
  
      if (price <= 125) {
        priceRanges["US$50 - US$125"]++;
      } else if (price >125 && price <= 250) {
        priceRanges["US$125 - US$250"]++;
      } else if (price >250 && price <= 325) {
        priceRanges["US$250 - US$325"]++;
      } else if (price >325 && price <= 500) {
        priceRanges["US$325 - US$500"]++;
      } else {
        priceRanges["US$500 and above"]++;
      }
    });
  
    return priceRanges;
  };

  const categorizeHotelsByRating = (hotels) => {
    const ratings = {
      "9+": 0,
      "8+": 0,
      "7+": 0,
    };
  
    hotels.forEach((hotel) => {
      const rrr = parseFloat(hotel.review_score);
  
      if (rrr > 9) {
        ratings["9+"]++;
      } else if (rrr > 8) {
        ratings["8+"]++;
      } else if (rrr > 7) {
        ratings["7+"]++;
      } 
    });
  
    return ratings;
  };

  const categorizeHotelsByReview = (hotels) => {
    const reviews = {
      "Superb": 0,
      "Fabulous": 0,
      "Very good": 0,
      "Good": 0
    };
  
    hotels.forEach((hotel) => {
      if (reviews.hasOwnProperty(hotel.review_score_word)) {
        reviews[hotel.review_score_word]++;
      }
    });
  
    return reviews;
  };

  const priceRanges = {
    "US$50 - US$125": [50, 125],
    "US$125 - US$250": [125, 250],
    "US$250 - US$325": [250, 325],
    "US$325 - US$500": [325, 500],
    "US$500 and above": [500, Infinity]
  };

  const applyFilters = (price, rating, review) => {
    let newHotels = hotels;
    console.log("the price now ", price);

    if (price) {
      const [min, max] = priceRanges[price];
      console.log(min);
      newHotels = newHotels.filter(hotel => {
        const hotelPrice = parseFloat(hotel.gross_amount.toString().replace("US$", ""));
        return hotelPrice >= min && hotelPrice <= max;
    });
    }

    if (rating) {
      const minRating = parseInt(rating);
      newHotels = newHotels.filter(hotel => hotel.review_score >= minRating && hotel.review_score < minRating + 1);
    }

    if (review) {
      newHotels = newHotels.filter(hotel => hotel.review_score_word === review);
    }

    setFilteredHotels(newHotels);
  };

  const handlePriceChange = (value) => {
    console.log("the selected price: ", value);
    setSelectedPrice(value === selectedPrice ? null : value);
    applyFilters(value === selectedPrice ? null : value, selectedRating, selectedReview);
  };

  const handleRatingChange = (value) => {
    setSelectedRating(value === selectedRating ? null : value);
    applyFilters(selectedPrice, value === selectedRating ? null : value, selectedReview);
  };

  const handleReviewChange = (value) => {
    setSelectedReview(value === selectedReview ? null : value);
    applyFilters(selectedPrice, selectedRating, value === selectedReview ? null : value);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  
    if (tab === 'recommended') {
      setFilteredHotels(hotels); // Reset to original order
    } else {
      const sorted = [...hotels].sort((a, b) => {
        const priceA = parseFloat(a.gross_amount.replace("US$", "").replace(",", ""));
        const priceB = parseFloat(b.gross_amount.replace("US$", "").replace(",", ""));
        
        return tab === 'low-to-high' ? priceA - priceB : priceB - priceA;
      });
  
      setFilteredHotels(sorted);
    }
  };
  
  // Example Usage
  useEffect(() => {
    const priceCts = categorizeHotelsByPrice(hotels);
    const ratingCts = categorizeHotelsByRating(hotels);
    const reviewCts = categorizeHotelsByReview(hotels);

    setPriceCounts(priceCts);
    setRatingCounts(ratingCts);
    setReviewCounts(reviewCts);
  }, [hotels]);

  const handleBooking = async (event, hotel) => {
    event.preventDefault();

    const validDayDifference = Math.max(dayDifference, 1);

    const roomNo = searchState.rooms;
  
    const amount = parseFloat(hotel.gross_amount.replace("US$", "").replace(",", ""));
    const validAmount = Math.round(amount * roomNo * 100);
    const today = new Date();

    console.log("Handle booking is called")

    const paymentInfo = {
      amount: validAmount,
      name: hotel.hotel_name,
      product_id: hotel.hotel_id,
      fromDate: searchState.checkInDate,
      toDate: searchState.checkOutDate,
      quantity: validDayDifference,
      multiplier: 100,
      currency: 'USD',
      email: 'hmzzzz2004@gmail.com', // to replace with user's email
      user_id: 1, // to replace with user's id
      status: "PAID",
      category: "hotel",
      transaction_date: today.toISOString()
    };

    console.log("Payment input:", paymentInfo);
  
    try {
      const response = await checkPaymentHotel({
        paymentInfo: paymentInfo
      });
  
      console.log("Payment response:", response);

      if (response.status === 200) {
        console.log(response.data.sessionUrl);
        window.location.href = response.data.sessionUrl;

      } else {
        console.log("Payment failed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Header />
      <HeaderBg title={"Hotels"} flag={false} images={['/images/hotel-header-bg.jpg']} bgColor={'bg-black opacity-30'}/>
      
      <form onSubmit={handleSubmitForm} id="input-box" className="mx-4 sm:mx-8 lg:mx-12 px-6 -mt-28 relative">
        <div className="bg-white rounded-xl shadow-lg px-8 py-8 h-full space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-6">
            <div className="border w-full flex items-center justify-between p-4 rounded-lg">
              <div className="flex-1">
                <label className="block text-gray-600/75 text-sm font-bold mb-1">Destination</label>
                <input type="text" required placeholder="Where are you going?" name="destination" id="destination" value={searchState.destination}
                     onChange={handleInputChange}
                     className="w-full bg-gray-100 mt-1 border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-slate-700"/>
              </div>
            </div>
            <div className="border w-full flex items-center justify-between p-4 rounded-lg space-x-3">
                <div className="flex-1">
                    <label className="block text-gray-600/75 text-sm font-bold mb-1">Check-in</label>
                    <input type="date" name="checkInDate" id="checkInDate" value={searchState.checkInDate}
                     onChange={handleInputChange}
                     className="w-full bg-gray-100 mt-1 border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-slate-700"/>
                </div>
                <div className="flex-1">
                    <label className="block text-gray-600/75 text-sm font-bold mb-1">Check-out</label>
                    <input type="date" name="checkOutDate" id="checkOutDate" value={searchState.checkOutDate}
                     onChange={handleInputChange}
                     className="w-full bg-gray-100 mt-1 border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-slate-700"/>
                </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border w-full flex items-center justify-between p-4 rounded-lg">
                <div className="flex-1">
                    <label className="block text-gray-600/75 text-sm font-bold mb-1">Rooms</label>
                    <input type="number" name="rooms" id="rooms" value={searchState.rooms}
                     onChange={handleInputChange}
                     className="w-full bg-gray-100 mt-1 border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-slate-700"/>
                </div>
            </div>
            <div className="border w-full flex items-center justify-between p-4 rounded-lg space-x-4 col-span-2">    
                <div className="flex-1">
                    <label className="block text-gray-600/75 text-sm font-bold mb-1">Adults</label>
                    <input type="number" name="adults" id="adults" value={searchState.adults}
                     onChange={handleInputChange}
                     className="w-full bg-gray-100 mt-1 border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-slate-700"/>
                </div>
                <div className="flex-1">
                    <label className="block text-gray-600/75 text-sm font-bold mb-1">Children</label>
                    <input type="number" name="children" id="children" value={searchState.children}
                     onChange={handleInputChange}
                     className="w-full bg-gray-100 mt-1 border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-slate-700"/>
                </div>
            </div>
            <div className="flex items-end justify-end w-full pt-4">
                <button type="submit" className="font-poppins text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 py-3 px-8 rounded-lg hover:shadow-xl transition flex items-center justify-center gap-2 font-semibold transform hover:translate-y-[-2px]">
                    <FontAwesomeIcon icon={faSearch} />
                    Search Hotels
                </button>
            </div>
          </div>
        </div>
      </form>

      {hotels.length > 0 ? (
        <div className="flex flex-col md:flex-row md:space-x-8 p-4 mx-2 md:p-8 my-7">
          {/* Filter card */}
          <div className='flex flex-col space-y-6 w-full md:w-72'>
            <div id="filter-section" className={`w-full md:w-72 p-4 md:p-8 rounded-lg shadow-md bg-white transition-all duration-300 overflow-hidden max-h-screen opacity-100 `} >
              <div className='flex justify-between items-center'>
                <h3 className='text-lg font-poppins font-semibold'> Filter </h3>
                <p className='text-blue-500 text-xs text-right font-poppins' onClick={() => {
                  setSelectedPrice(null);
                  setSelectedRating(null);
                  setSelectedReview(null);
                  setFilteredHotels(hotels);
                }}> Clear all filter </p>
              </div>
              <hr className='my-5 border-t-1 border-gray-300'/>

              {/* Price Filter */}
              <div className='space-y-1'>
                <h3 className='text-sm font-semibold'>Price</h3>
                {Object.keys(priceRanges).map((range) => (
                  <label key={range} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedPrice === range}
                        onChange={() => handlePriceChange(range)}
                      />
                      <span className="text-sm ml-2">{range}</span>
                    </div>
                    <p className="text-xs font-poppins font-semibold">{ priceCounts[range] }</p>
                  </label>
                ))}
              </div>
              <hr className='my-5 border-t-1 border-gray-300'/>

              {/* Rating Filter */}
              <div className='space-y-1'>
                <h3 className='text-sm font-semibold'>Rating Score</h3>
                {["9+", "8+", "7+"].map((rating) => (
                  <label key={rating} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input 
                        type="checkbox"
                        checked={selectedRating === rating}
                        onChange={() => handleRatingChange(rating)}
                      />
                      <span className="text-sm ml-2">{ rating }</span>
                    </div>
                    <p className="text-xs font-poppins font-semibold">{ ratingCounts[rating] }</p>
                  </label>
                ))}
              </div>
              <hr className='my-5 border-t-1 border-gray-300'/>

              {/* Review Filter */}
              <div className='space-y-1'>
                <h3 className='text-sm font-semibold'>Reviews</h3>
                {["Superb", "Fabulous", "Very good", "Good"].map((review) => (
                  <label key={review} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedReview === review}
                        onChange={() => handleReviewChange(review)}
                      />
                      <span className="text-sm ml-2">{ review }</span>
                    </div>
                    <p className="text-xs font-poppins font-semibold">{ reviewCounts[review] }</p>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Data display */}
          <div className="space-y-4 flex-1">
            {/* price sort tabs */}
            <div className="h-10 mb-7 mr-8">
              <div className="w-full flex flex-row">
                <div
                  className={`w-1/3 mr-2 py-2 px-4 text-center font-poppins text-sm shadow-sm rounded-xl cursor-pointer ${
                    activeTab === 'recommended' ? 'bg-sky-100 border border-sky-200' : 'bg-slate-100'
                  }`}
                  onClick={() => handleTabClick('recommended')}
                >
                  Recommended First <i className="fa-duotone fa-light fa-stars ml-2"></i>
                </div>
                <div
                  className={`w-1/3 mx-2 py-2 px-4 text-center font-poppins text-sm shadow-sm rounded-xl cursor-pointer ${
                    activeTab === 'low-to-high' ? 'bg-sky-100 border border-sky-200' : 'bg-slate-100'
                  }`}
                  onClick={() => handleTabClick('low-to-high')}
                >
                  Price Lowest - Highest <i className="fa-duotone fa-solid fa-arrow-down-short-wide ml-2"></i>
                </div>
                <div
                  className={`w-1/3 ml-2 py-2 px-4 text-center font-poppins text-sm shadow-sm rounded-xl cursor-pointer ${
                    activeTab === 'high-to-low' ? 'bg-sky-100 border border-sky-200' : 'bg-slate-100'
                  }`}
                  onClick={() => handleTabClick('high-to-low')}
                >
                  Price Highest - Lowest <i className="fa-duotone fa-solid fa-arrow-up-short-wide ml-2"></i>
                </div>
              </div>
            </div>

            {filteredHotels && filteredHotels.map((hotel, index) => {
              // Function to generate stars based on hotel class
              const renderStars = (hotelClass) => {
                const stars = [];
                for (let i = 0; i < hotelClass; i++) {
                  stars.push(
                    <svg key={i} className="w-4 h-4 text-yellow-500 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
                    </svg>
                  );
                }
                return stars;
              };

              return (
                <div key={index} className='h-[280px] mr-8 bg-slate-50 rounded-lg flex flex-row shadow-md'>
                  <div className='w-1/4 h-full'>
                    <img src={hotel.photo_url} alt="hotel" className='w-full h-full object-cover rounded-l-lg'/>
                  </div>
                  <div className='w-3/4 h-full'>
                    <div className='flex flex-col p-6'>
                      <div className="flex items-center">
                        <h1 className='text-lg font-semibold font-poppins mr-2'>{hotel.hotel_name}</h1>
                        {/* Render stars based on hotel.class */}
                        {renderStars(hotel.class)}
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <p className="bg-blue-100 text-xs text-blue-800 font-semibold inline-flex items-center p-1.5 rounded-sm dark:bg-blue-200 dark:text-blue-800">{hotel.review_score}</p>
                        <p className="ms-2 font-medium text-xs text-gray-900 dark:text-white">{hotel.review_score_word}</p>
                        <span className="w-1 h-1 mx-2 text-xs bg-gray-900 rounded-full dark:bg-gray-500"></span>
                        <p className="font-medium text-xs text-gray-500 dark:text-gray-400">{hotel.review_nr} reviews</p>
                      </div>
                      <p className='text-xs font-poppins text-gray-500'> <i className="fa-solid fa-location-check mr-1"></i> {hotel.city}</p>
                        
                      
                      <div className='w-full text-xs font-poppins p-4 mt-3 rounded-lg bg-sky-50 flex flex-row'>
                        <div className='w-2/3'>
                          <div dangerouslySetInnerHTML={{ __html: hotel.unit }} />
                          <div className='flex flex-row space-x-5 mt-2'>
                            {/* Check-in Info */}
                            <div className="flex items-center space-x-1">
                              <i class="fa-solid fa-bell-concierge"></i>
                              <span className="font-medium text-xs">Check-in:</span>
                              <span className="ml-1 text-xs">{hotel.checkInFrom}</span>
                            </div>

                            {/* Check-out Info */}
                            <div className="flex items-center space-x-1">
                              <i class="fa-duotone fa-solid fa-door-open"></i>
                              <span className="font-medium text-xs">Check-out:</span>
                              <span className="ml-1 text-xs">{hotel.checkOutFrom}</span>
                            </div>
                          </div>

                          <p className='text-[10px] mt-12'>{getRandomTime()}</p>
                        </div>
                        <div className='w-1/3 relative'>
                          <p className='font-bold font-poppins text-blue-600 text-2xl absolute top-0 right-0'> {hotel.gross_amount} </p>
                          <p className='font-poppins text-[11px] mb-4 absolute top-8 right-0'> incl taxes & fees </p>

                          <form action="POST" onSubmit={(event) => handleBooking(event, hotel)}>
                            <button type="submit" className="group rounded-sm text-white bg-blue-600 px-8 py-2 text-sm absolute bottom-0 right-0 flex items-center transform transition-all duration-300 hover:translate-y-[-5px] hover:z-10">
                                Book Now
                                <i className="fa-solid fa-arrow-right ml-2 transform transition-all duration-300 group-hover:translate-x-1.5"></i>
                            </button>
                          </form>
                          

                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>     
        </div>
        ) : error ? (
          <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">{error}</div>
        ) : (
          <></>
        )
      }

      <div className={hotels.length === 0 ? 'mt-[600px]' : ''}>
          <SubscriptionSection />
          <Footer />
      </div>
    </>
  );
};

export default Hotel;