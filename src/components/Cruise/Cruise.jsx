import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './CruiseHeader';
import Footer from '../Dashboard/Footer';
import SubscriptionSection from '../Dashboard/SubscriptionSection';

function Cruise() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ships, setShips] = useState([]);
  const [departureCities, setDepartureCities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filteredShips, setFilteredShips] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCruiseLines, setSelectedCruiseLines] = useState([]);
  const [selectedShipNames, setSelectedShipNames] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [sortOption, setSortOption] = useState('mostRecommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [shipsPerPage] = useState(10);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const PIXABAY_API_KEY = '48566746-1f497e57e6596e43958245183'; // Replace with your Pixabay API key

  useEffect(() => {
    axios.get("../data/cruise.json").then(async (res) => {
      const shipsWithImages = await Promise.all(res.data.Ships.map(async (ship) => {
        const imageUrl = await fetchImageFromPixabay(ship['CruiseLine']);
        return { ...ship, imageUrl };
      }));

      const sortedShips = shipsWithImages.sort((a, b) => b.Rating - a.Rating);
      setShips(sortedShips);
      setFilteredShips(sortedShips);

      setDepartureCities([...new Set(sortedShips.map(ship => ship.DepartCity))]);
      setDestinations([...new Set(sortedShips.map(ship => ship.Destination))]);
    });

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    console.log("The user data in cruise page: ", location.state.original.userData)
  }, [])

  const fetchImageFromPixabay = async (query) => {
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query + ' cruise ship')}&image_type=photo`;
    try {
      const response = await axios.get(url);
      if (response.data.hits.length > 0) {
        return response.data.hits[0].webformatURL;
      }
    } catch (error) {
      console.error('Error fetching image from Pixabay:', error);
    }
    return 'https://via.placeholder.com/150';
  };

  const handleSearch = () => {
    const matchedShips = ships.filter(ship => {
      const shipMonth = new Date(ship.Date).toLocaleString('default', { month: 'long' });
      return (
        (selectedCity ? ship.DepartCity === selectedCity : true) &&
        (selectedDestination ? ship.Destination === selectedDestination : true) &&
        (selectedMonth ? shipMonth === selectedMonth : true)
      );
    });
    setFilteredShips(matchedShips);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    let sortedShips = [...filteredShips];

    switch (option) {
      case 'mostRecommended':
        sortedShips.sort((a, b) => b.Rating - a.Rating);
        break;
      case 'priceLowToHigh':
        sortedShips.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        sortedShips.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredShips(sortedShips);
  };

  const handleCruiseLineChange = (line) => {
    setSelectedCruiseLines(prev => {
      if (prev.includes(line)) {
        return prev.filter(l => l !== line);
      } else {
        return [...prev, line];
      }
    });
  };

  const handleShipNameChange = (name) => {
    setSelectedShipNames(prev => {
      if (prev.includes(name)) {
        return prev.filter(n => n !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  const handlePriceRangeChange = (min, max) => {
    setSelectedPriceRange(prev => 
      prev?.min === min && prev?.max === max ? null : { min, max }
    );
  };

  const finalFilteredShips = filteredShips.filter(ship => (
    (selectedCruiseLines.length > 0 ? selectedCruiseLines.includes(ship.CruiseLine) : true) &&
    (selectedShipNames.length > 0 ? selectedShipNames.includes(ship['Ship Name']) : true) &&
    (selectedPriceRange 
      ? ship.price >= selectedPriceRange.min && ship.price <= selectedPriceRange.max
      : true)
  ));
  

  const indexOfLastShip = currentPage * shipsPerPage;
  const indexOfFirstShip = indexOfLastShip - shipsPerPage;
  const currentShips = finalFilteredShips.slice(indexOfFirstShip, indexOfLastShip);
  const totalPages = Math.ceil(finalFilteredShips.length / shipsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, document.getElementById('cruise-content').offsetTop);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const prepareDataForCruiseBooking = (e, ship) => {
    e.preventDefault(); // Prevent default form submission behavior
    navigate(`/cruises/${ship.CruiseId}`, {
      state: { userData: location.state.original.userData },
    });
  };
  
  return (
    
    <>
    <Header user={location.state.original.userData}/>
      <section id="cruise-search" className="bg-cover bg-center w-full relative top-0 min-h-[640px] md:min-h-[400px]">
        <img
          className="absolute inset-0 w-full h-full object-cover brightness-90"
          src="https://static.tripcdn.com/modules/vacation/vacationpic/cruise/trippc/homebanner_new.jpg"
          alt="Cruise Background"
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-full max-w-5xl space-y-0 md:px-5 px-[15%]">
            <h1 className="text-6xl font-bold text-white mb-4">Cruises</h1>
            <div className="flex flex-col md:flex-row gap-4 items-end bg-white bg-opacity-100 p-5 rounded-lg shadow-lg mx-auto">
              <div className="flex-1 w-full">
                <label className="text-sm font-medium text-gray-700">Depart From</label>
                <select
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">All Departure Cities</option>
                  {departureCities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 w-full">
                <label className="text-sm font-medium text-gray-700">Sail For</label>
                <select
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                >
                  <option value="">All Destinations</option>
                  {destinations.map((destination, index) => (
                    <option key={index} value={destination}>{destination}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 w-full">
                <label className="text-sm font-medium text-gray-700">Departure Month</label>
                <select
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="">All Months</option>
                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-auto">
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedCity && !selectedDestination && !selectedMonth}
                >
                  <span>Search</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.9 14.32a8 8 0 111.42-1.42l4.38 4.37a1 1 0 11-1.42 1.42l-4.37-4.38zM8 14a6 6 0 100-12 6 6 0 000 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cruise-content" className="px-6 py-10 bg-gray-100 rounded-t-[30px] w-full -translate-y-12">
        <div className="container mx-auto">

          <div className="md:hidden sticky top-4 z-50 mb-4 flex justify-end">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>

          <div id='data-display' className="flex flex-col md:flex-row gap-6">
            {/* Filter Card */}
            <div
              className={`w-full md:w-1/4 bg-white px-8 py-6 rounded-lg shadow-md fixed md:static h-fit transform ${
                isFilterOpen ? 'translate-x-0' : '-translate-x-full'
              } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
              style={{ top: '0', left: '0' }}
            >
              <h2 className="text-xl font-bold mb-4">Filters</h2>
              <div className="border-b border-gray-300 my-5"></div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Cruise Line</h3>
                  <div className="space-y-2">
                    {[...new Set(filteredShips.map(ship => ship.CruiseLine))].map((line, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="h-4 w-4 rounded border-gray-300"
                            checked={selectedCruiseLines.includes(line)} onChange={() => handleCruiseLineChange(line)}
                          />
                          <span className="text-sm ml-2">{line}</span>
                        </label>
                        <span className="text-xs font-poppins font-semibold">
                          {filteredShips.filter(ship => ship.CruiseLine === line).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-b border-gray-300 my-5"></div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Ship Name</h3>
                  <div className="space-y-2">
                    {[...new Set(filteredShips.map(ship => ship['Ship Name']))].map((name, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input type="checkbox" className="h-4 w-4 rounded border-gray-300"
                            checked={selectedShipNames.includes(name)} onChange={() => handleShipNameChange(name)}
                          />
                          <span className="text-sm ml-2">{name}</span>
                        </label>
                        <span className="text-xs font-poppins font-semibold">
                          {filteredShips.filter(ship => ship['Ship Name'] === name).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-b border-gray-300 my-5"></div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {[
                      { range: '$500 - $1000', min: 500, max: 1000 },
                      { range: '$1000 - $2000', min: 1000, max: 2000 },
                      { range: '$2000 - $3000', min: 2000, max: 3000 },
                      { range: '$3000+', min: 3000, max: 5000 }
                    ].map((priceOption, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={selectedPriceRange?.min === priceOption.min && selectedPriceRange?.max === priceOption.max}
                            onChange={() => handlePriceRangeChange(priceOption.min, priceOption.max)}
                          />
                          <span className="text-sm ml-2">{priceOption.range}</span>
                        </label>
                        <span className="text-xs font-poppins font-semibold">
                          {filteredShips.filter(ship => 
                            ship.price >= priceOption.min && ship.price <= priceOption.max
                          ).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex-1 md:w-3/4">
              {/* Sorting Buttons */}
              <div className="flex justify-center items-center w-full md:justify-start gap-4 mb-6">
                <button onClick={() => handleSortChange('mostRecommended')}
                  className={`text-sm md:text-base flex-1 px-0 py-3 rounded-lg shadow-lg transition-colors duration-500 ${
                    sortOption === 'mostRecommended'
                      ? 'bg-blue-950 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Most Recommended
                </button>
                <button
                  onClick={() => handleSortChange('priceLowToHigh')}
                  className={`text-sm md:text-base flex-1 px-0 py-3 rounded-lg shadow-lg transition-colors duration-500 ${
                    sortOption === 'priceLowToHigh'
                      ? 'bg-blue-950 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Price <span className='text-nowrap'>(Low to High)</span>
                </button>
                <button
                  onClick={() => handleSortChange('priceHighToLow')}
                  className={`text-sm md:text-base flex-1 px-0 py-3 rounded-lg shadow-lg transition-colors duration-500 ${
                    sortOption === 'priceHighToLow'
                      ? 'bg-blue-950 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  Price <span className='text-nowrap'>(High to Low)</span>
                </button>
              </div>

              {/* Resulted Ships */}

              {currentShips.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {currentShips.map((ship) => (
                    <div key={ship.CruiseId} className="bg-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start" >
                      <div className="w-full md:w-48 h-48 flex-shrink-0 overflow-hidden rounded-lg">
                        <img src={ship.imageUrl} alt={ship['Ship Name']} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <div className="mt-4 w-full flex flex-wrap md:mt-2 md:ml-6 flex-1 p-3 md:p-0">
                        <div className='grid -cols-1 gap-y-12'>
                          <div className='grid -cols-1'>
                            <h2 className="text-2xl text-blue-950 font-bold mb-1">{ship.Itinerary.length - 1}-Night {ship.Destination} Cruise</h2>
                            <div className="flex">
                              <p className='flex items-center justify-center bg-blue-200 px-[4px] rounded-sm text-blue-700 text-xs font-bold'>{ship.Rating} <i className="fa-solid fa-star text-blue-700 ml-1"></i></p>
                              <p className="font-semibold text-blue-950 text-sm ml-2">{ship['Ship Name']}</p>
                              <div className="mr-1 ml-1 font-normal text-sm"> | </div>
                              <p className="font-normal text-blue-950 text-sm">{ship.CruiseLine}</p>
                            </div>
                          </div>
                          <div className='block'>       
                            <p className='text-sm text-blue-950'><i className="fa-solid fa-anchor text-blue-950 mr-1"></i> {ship.DepartCity}</p>
                            <p className='text-sm text-blue-950'><i className="fa-solid fa-calendar-days text-blue-950 mr-1 text-lg"></i> {ship.Itinerary[0].Date}</p>
                            <p className='text-sm text-blue-950'><i className="fa-solid fa-ship text-blue-950 mr-1 text-sm"></i> {ship.Itinerary.map((itineraryItem, index) => itineraryItem.PortCity).join(' - ')}</p>
                          </div>
                        </div>
                        <div className='ml-auto flex flex-col justify-center items-end md:items-end mt-8'> {/* Updated CSS classes */}
                          <div className='flex flex-col items-end'>
                            <p className='text-3xl font-medium text-blue-950'> <span className='font-normal text-blue-950 text-sm'>From </span> ${ship.Staterooms[0].Price}</p>
                            <p className='font-normal text-sm text-blue-950'>per person incl. taxes & fees</p>
                          </div>
                          <form action="" onSubmit={(e) => prepareDataForCruiseBooking(e, ship)}>
                            <button type="submit"  className="bg-blue-950 text-white font-semibold py-2 px-4 rounded-3xl mt-2 hover:bg-blue-900 md:w-auto">
                              <span>Details</span>
                            </button>
                            </form>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>


              ) : (
                (selectedCity || selectedDestination || selectedMonth) && (
                  <p className="text-center text-gray-500">
                    No cruises available for the selected criteria.
                  </p>
                )
              )}

              {/* Add pagination controls after the ship listings */}
              {finalFilteredShips.length > shipsPerPage && (
                <div className="flex justify-center items-center mt-8 gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white text-blue-950 border border-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === index + 1
                          ? 'bg-blue-950 text-white'
                          : 'bg-white text-blue-950 border border-blue-950'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white text-blue-950 border border-blue-950 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={ships.length === 0 ? 'mt-[600px]' : ''}>
          <SubscriptionSection />
          <Footer />
      </div>
    </>
  );
}

export default Cruise;