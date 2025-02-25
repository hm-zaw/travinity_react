import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import vdo from "/vdo/vdo.mp4";

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState("Hotels & Homes");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cabinClass, setCabinClass] = useState("ECONOMY");
  const [adults, setAdults] = useState(1);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [destId, setDestId] = useState("");
  const [searchType, setSearchType] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [rooms, setRooms] = useState(1);
  const [children, setChildren] = useState(0);
  const navigate = useNavigate();

  const [dataCarry, setDataCarry] = useState({
    "destination": "",
    "checkinDate": "",
    "checkoutDate": "",
    "rooms": 1,
    "adults": 2,
    "children": 0
  })

  const handleHotelDataInput = (e) => {
    const { name, value } = e.target;
    setDataCarry(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  // Fetch suggestions from Booking.com RapidAPI
  const fetchSuggestions = async (query, setSuggestions) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        "https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination",
        {
          params: { query },
          headers: {
            "x-rapidapi-key": "02670754a0msh0b854492645b241p191547jsncd32c651b0ba", // Replace with your RapidAPI key
            "x-rapidapi-host": "booking-com15.p.rapidapi.com",
          },
        }
      );
      setSuggestions(response.data.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const fetchHotelDestinations = async (query) => {
    if (!query || query.length < 3) {
      setDestinationSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        "https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination",
        {
          params: { query },
          headers: {
            "x-rapidapi-key": "02670754a0msh0b854492645b241p191547jsncd32c651b0ba",
            "x-rapidapi-host": "booking-com15.p.rapidapi.com",
          },
        }
      );
      setDestinationSuggestions(response.data.data);
    } catch (error) {
      console.error("Error fetching hotel destinations:", error);
      setDestinationSuggestions([]);
    }
  };

  // Handle search button click for flights
  const handleSearch = () => {
    const searchData = {
      original: {
        from,
        to,
        departDate: departureDate,
        returnDate,
        cabinClass,
        adults,
      },
      converted: {
        fromId, // Send the ID instead of the name
        toId,   // Send the ID instead of the name
      },
    };

    navigate("/flight", { state: searchData });
  };

  const handleGuestChange = (e) => {
    const [roomsVal, adultsVal, childrenVal] = e.target.value.split(',').map(Number);
    setDataCarry(prevState => ({
      ...prevState,
      rooms: roomsVal,
      adults: adultsVal,
      children: childrenVal
    }));
  };

  const handleHotelDataSubmitMainPg = (e) => {
    e.preventDefault();
    navigate('/hotel', { state: dataCarry });
  }

  const tabs = [
    { name: "Hotels & Homes", icon: <i class="fa-regular fa-hotel"></i> },
    { name: "Flights", icon: <i class="fa-regular  fa-plane"></i> },
    { name: "Cruises", icon: <i class="fa-regular  fa-ship"></i> },
    { name: "Cars", icon: <i class="fa-regular  fa-car-side"></i> },
    { name: "Attractions & Tours", icon: <i class="fa-regular  fa-ferris-wheel"></i> },
    { name: "Flight + Hotel", icon: <i class="fa-regular  fa-truck-plane"></i> },
  ];

  useEffect(() => {
    console.log(dataCarry);
  }, [dataCarry])

  // Render the appropriate search form based on the active tab
  const renderSearchForm = () => {
    switch (activeTab) {
      case "Hotels & Homes":
        return (
          <div className="bg-white lg:bg-opacity-90 sm:bg-opacity-100 py-6 px-10 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-col gap-4 ">

              <form action="POST" className="space-y-3" onSubmit={handleHotelDataSubmitMainPg}>
                {/* Destination and Guest Input */}
                <div className="flex flex-row space-x-4">
                  <div className="relative flex-grow w-/3 md:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <input type="text" name="destination" placeholder="City, region, or property" value={dataCarry.destination}
                      onChange={async (e) => {
                        handleHotelDataInput(e)
                        fetchHotelDestinations(e.target.value);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all"
                    />
                    {destinationSuggestions.length > 0 && (
                      <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-1 w-full shadow-md">
                        {destinationSuggestions.map((suggestion) => (
                          <li key={suggestion.dest_id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => {
                              setDataCarry(prevState => ({
                                ...prevState,
                                destination: suggestion.name
                              }));
                              setDestinationSuggestions([]);
                            }}
                          >
                            {suggestion.name} ({suggestion.search_type})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Guests Selector */}
                  <div className="w-1/3 md:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                    <select 
                      value={`${dataCarry.rooms},${dataCarry.adults},${dataCarry.children}`}
                      onChange={handleGuestChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all"
                    >
                      <option value="1,2,0">1 room, 2 adults, 0 children</option>
                      <option value="2,4,2">2 rooms, 4 adults, 2 children</option>
                      <option value="3,6,4">3 rooms, 6 adults, 4 children</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-row space-x-4">
                    {/* Check-in Date */}
                    <div className="lg:w-1/3 md:w-auto">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                      <input type="date" value={dataCarry.checkinDate} name="checkinDate"
                        onChange={handleHotelDataInput}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all"
                      />
                    </div>
              
                    {/* Check-out Date */}
                    <div className="lg:w-1/3 md:w-auto">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                      <input
                        type="date" name="checkoutDate"
                        value={dataCarry.checkoutDate}
                        onChange={handleHotelDataInput}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Search Button */}
                    <div className="flex-grow flex justify-end pt-6">
                      <button type="submit"
                        className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all focus:ring-2 focus:ring-yellow-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!dataCarry.destination || !dataCarry.checkinDate || !dataCarry.checkoutDate}
                      >
                        Search
                      </button>
                    </div>
                </div>
              </form>
              
            </div>
          </div>
        );

      case "Flights":
        return (
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* From Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="From: City or airport"
                value={from}
                onChange={async (e) => {
                  setFrom(e.target.value);
                  fetchSuggestions(e.target.value, setFromSuggestions);
                }}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
              {fromSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full">
                  {fromSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFrom(suggestion.name); // Set the display name
                        setFromId(suggestion.id); // Set the ID for conversion
                        setFromSuggestions([]); // Clear suggestions
                      }}
                    >
                      {suggestion.name} ({suggestion.type}, {suggestion.countryName})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* To Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="To: City or airport"
                value={to}
                onChange={async (e) => {
                  setTo(e.target.value);
                  fetchSuggestions(e.target.value, setToSuggestions);
                }}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
              {toSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full">
                  {toSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setTo(suggestion.name); // Set the display name
                        setToId(suggestion.id); // Set the ID for conversion
                        setToSuggestions([]); // Clear suggestions
                      }}
                    >
                      {suggestion.name} ({suggestion.type}, {suggestion.countryName})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Departure and Return Date */}
            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Departure
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Return
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Cabin Class */}
            <select
              value={cabinClass}
              onChange={(e) => setCabinClass(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            >
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
              <option value="BUSINESS">Business</option>
              <option value="FIRST">First Class</option>
            </select>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-md hover:bg-yellow-600 transition"
            >
              Search
            </button>
          </div>
        );

      // Other cases (Hotels & Homes, Trains, Cars, Attractions & Tours, Flight + Hotel) remain unchanged
      default:
        return null;
    }
  };

  return (
    <div className="relative h-[calc(110vh-4rem)] pt-16">
      {/* Video Background */}
      <video className="absolute inset-0 w-full h-full object-cover brightness-125" src={vdo} autoPlay loop muted></video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-800/30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl lg:mt-16 sm:mt-20 mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
        <h1 className="text-white text-4xl sm:text-5xl font-bold mb-6 text-center">
          Plan Your Next Adventure with Ease
        </h1>
        <p className="text-white text-lg sm:text-xl mb-10 text-center">
          Find the best deals for hotels, flights, and more.
        </p>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2 rounded-full text-[15px] sm:text-[17px] transition ${
                activeTab === tab.name
                  ? "bg-yellow-500 text-gray-900 shadow-lg"
                  : "bg-gray-900 text-white hover:bg-yellow-500 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <span className="text-lg sm:text-xl">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Search Section */}
        <div className="rounded-md shadow-lg max-w-4xl w-full">
          {renderSearchForm()}
        </div>
      </div>
    </div>
    
  );
};

export default HeroSection;