import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlaneDeparture,
  faPlaneArrival,
  faClock,
  faChair,
  faExchangeAlt,
  faDollarSign,
  faCalendarAlt,
  faUser,
  faSuitcase,
  faBriefcase,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';


const Flight = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [searchState, setSearchState] = useState({
    from: location.state?.original?.from || '',
    to: location.state?.original?.to || '',
    fromId: location.state?.converted?.fromId || '',
    toId: location.state?.converted?.toId || '',
    departDate: location.state?.original?.departDate || '',
    returnDate: location.state?.original?.returnDate || '',
    cabinClass: location.state?.original?.cabinClass || 'ECONOMY',
    adults: location.state?.original?.adults || 1,
  });

  const [suggestions, setSuggestions] = useState({ from: [], to: [] });
  const [activeField, setActiveField] = useState(null);

  // Filter states
  const [selectedAirlines, setSelectedAirlines] = useState([]);
  const [priceRange, setPriceRange] = useState(2000);
  const [selectedCabinClass, setSelectedCabinClass] = useState('');

  useEffect(() => {
    if (location.state?.converted) {
      handleAutoSearch();
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [flights, selectedAirlines, priceRange, selectedCabinClass]);

  const fetchSuggestions = async (query, fieldType) => {
    if (!query || query.length < 3) {
      setSuggestions((prev) => ({ ...prev, [fieldType]: [] }));
      return;
    }

    try {
      const response = await axios.get(
        'https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination',
        {
          params: { query },
          headers: {
            'x-rapidapi-key': '02670754a0msh0b854492645b241p191547jsncd32c651b0ba',
            'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
          },
        }
      );

      const processed = response.data.data.map((item) => ({
        name: item.name,
        type: item.type,
        country: item.countryName,
        id: item.id,
      }));

      setSuggestions((prev) => ({ ...prev, [fieldType]: processed }));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions((prev) => ({ ...prev, [fieldType]: [] }));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeField && searchState[activeField]) {
        fetchSuggestions(searchState[activeField], activeField);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchState[activeField], activeField]);

  const handleSuggestionClick = (fieldType, name, id) => {
    setSearchState((prev) => ({
      ...prev,
      [fieldType]: name,
      [`${fieldType}Id`]: id,
    }));
    setSuggestions((prev) => ({ ...prev, [fieldType]: [] }));
  };

  const handleAutoSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/searchFlights', {
        params: {
          fromId: searchState.fromId,
          toId: searchState.toId,
          departDate: searchState.departDate,
          returnDate: searchState.returnDate,
          cabinClass: searchState.cabinClass,
          adults: searchState.adults,
          currency: 'USD',
        },
        headers: {
          'X-RapidAPI-Key': '02670754a0msh0b854492645b241p191547jsncd32c651b0ba',
          'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com',
        },
      });

      const flightData = response.data.data?.flightOffers || [];
      setFlights(flightData.map(formatFlightData));
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading flights');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('http://localhost:8080/searchFlights', {
        params: {
          fromId: searchState.fromId,
          toId: searchState.toId,
          departDate: searchState.departDate,
          returnDate: searchState.returnDate,
          cabinClass: searchState.cabinClass,
          adults: searchState.adults,
          currency: 'USD',
        },
        headers: {
          'X-RapidAPI-Key': '02670754a0msh0b854492645b241p191547jsncd32c651b0ba',
          'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com',
        },
      });

      const flightData = response.data.data?.flightOffers || [];
      setFlights(flightData.map(formatFlightData));
    } catch (err) {
      setError(err.response?.data?.message || 'Error searching flights');
    } finally {
      setLoading(false);
    }
  };

  const handleCabinClassChange = async (e) => {
    const newCabinClass = e.target.value;
    setSearchState(prev => ({ ...prev, cabinClass: newCabinClass }));
    
    // Only search if we have the required fields
    if (searchState.fromId && searchState.toId && searchState.departDate) {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('http://localhost:8080/searchFlights', {
          params: {
            fromId: searchState.fromId,
            toId: searchState.toId,
            departDate: searchState.departDate,
            returnDate: searchState.returnDate,
            cabinClass: newCabinClass, // Use the new cabin class
            adults: searchState.adults,
            currency: 'USD',
          },
          headers: {
            'X-RapidAPI-Key': '02670754a0msh0b854492645b241p191547jsncd32c651b0ba',
            'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com',
          },
        });

        const flightData = response.data.data?.flightOffers || [];
        setFlights(flightData.map(formatFlightData));
      } catch (err) {
        setError(err.response?.data?.message || 'Error searching flights');
      } finally {
        setLoading(false);
      }
    }
  };

  const formatFlightData = (flight) => {
    const totalDuration = flight.segments.reduce((sum, segment) => sum + (segment.totalTime || 0), 0);
    const firstSegment = flight.segments[0] || {};
    const legs = firstSegment.legs || [];
    const firstLeg = legs[0] || {};
    const lastLeg = legs[legs.length - 1] || {};

    // Extracting Baggage Information
    const checkedBaggage = firstSegment.travellerCheckedLuggage?.[0]?.luggageAllowance || {};
    const cabinBaggage = firstSegment.travellerCabinLuggage?.[0]?.luggageAllowance || {};

    return {
      id: flight.token,
      airlineName: firstLeg.carriersData?.[0]?.name || 'Unknown Airline',
      airlineLogo: firstLeg.carriersData?.[0]?.logo || '',
      flightNumber: firstLeg.flightInfo?.flightNumber || 'N/A',
      departureTime: firstLeg.departureTime,
      departureIata: firstLeg.departureAirport?.code,
      departureName: firstLeg.departureAirport?.name || firstLeg.departureAirport?.code,
      arrivalTime: lastLeg.arrivalTime,
      arrivalIata: lastLeg.arrivalAirport?.code,
      arrivalName: lastLeg.arrivalAirport?.name || lastLeg.arrivalAirport?.code,
      duration: formatDuration(totalDuration),
      cabinClass: firstLeg.cabinClass || 'Economy',
      layovers: legs
        .slice(1, -1)
        .map((leg) => leg.arrivalAirport?.name || leg.arrivalAirport?.code)
        .filter(Boolean),
      price: formatPrice(flight.priceBreakdown?.total),
      bookingLink: `https://flights.booking.com/book/${flight.token}`,
      baggage: {
        checked: checkedBaggage.maxPiece
          ? `${checkedBaggage.maxPiece} pcs (${checkedBaggage.maxWeightPerPiece || checkedBaggage.maxTotalWeight} ${checkedBaggage.massUnit})`
          : 'Not Included',
        cabin: cabinBaggage.maxPiece
          ? `${cabinBaggage.maxPiece} pcs (${cabinBaggage.maxWeightPerPiece} ${cabinBaggage.massUnit})`
          : 'Not Included',
      },
      seatAvailability: flight.seatAvailability?.numberOfSeatsAvailable || 'N/A',
    };
  };

  const formatDuration = (totalSeconds) => {
    if (!totalSeconds || isNaN(totalSeconds)) return 'N/A';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatPrice = (priceData) => ({
    amount: (priceData?.units || 0) + (priceData?.nanos ? priceData.nanos / 1e9 : 0),
    currency: priceData?.currencyCode || 'USD',
  });

  const applyFilters = () => {
    let filtered = flights;

    // Filter by selected airlines
    if (selectedAirlines.length > 0) {
      filtered = filtered.filter((flight) => selectedAirlines.includes(flight.airlineName));
    }

    // Filter by price range
    filtered = filtered.filter((flight) => flight.price.amount <= priceRange);

    // Filter by cabin class
    if (selectedCabinClass) {
      filtered = filtered.filter((flight) => flight.cabinClass === selectedCabinClass);
    }

    setFilteredFlights(filtered);
  };

  return (
    <>
      <section id="flight-search" className="bg-cover bg-center w-full relative top-0 min-h-[640px] cruise-sm-custom:min-h-[400px]">
        <img
          className="absolute inset-0 w-full h-full object-cover brightness-90"
          src="https://static.tripcdn.com/modules/vacation/vacationpic/cruise/trippc/homebanner_new.jpg"
          alt="Flight Background"
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-full max-w-6xl space-y-0 px-5">
            <h1 className="text-6xl font-bold text-white mb-4">Flights</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white bg-opacity-100 p-5 rounded-lg shadow-lg mx-auto">
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <label className="text-sm font-medium text-gray-700">From</label>
                  <div className="relative">
                    <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                      <FontAwesomeIcon icon={faPlaneDeparture} className="text-gray-500 mr-3 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="City or airport"
                        value={searchState.from}
                        onChange={(e) => setSearchState((prev) => ({ ...prev, from: e.target.value }))}
                        onFocus={() => setActiveField('from')}
                        className="w-full bg-transparent focus:outline-none placeholder-gray-400 truncate"
                      />
                    </div>
                    {activeField === 'from' && suggestions.from.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.from.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick('from', suggestion.name, suggestion.id)}
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                          >
                            <div className="font-medium">{suggestion.name}</div>
                            <div className="text-sm text-gray-500">{suggestion.type} • {suggestion.country}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full">
                  <label className="text-sm font-medium text-gray-700">To</label>
                  <div className="relative">
                    <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                      <FontAwesomeIcon icon={faPlaneArrival} className="text-gray-500 mr-3 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="City or airport"
                        value={searchState.to}
                        onChange={(e) => setSearchState((prev) => ({ ...prev, to: e.target.value }))}
                        onFocus={() => setActiveField('to')}
                        className="w-full bg-transparent focus:outline-none placeholder-gray-400 truncate"
                      />
                    </div>
                    {activeField === 'to' && suggestions.to.length > 0 && (
                      <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.to.map((suggestion) => (
                          <div
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick('to', suggestion.name, suggestion.id)}
                            className="p-3 hover:bg-gray-100 cursor-pointer"
                          >
                            <div className="font-medium">{suggestion.name}</div>
                            <div className="text-sm text-gray-500">{suggestion.type} • {suggestion.country}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full">
                <label className="text-sm font-medium text-gray-700">Departure Date</label>
                <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-3 flex-shrink-0" />
                  <input
                    type="date"
                    value={searchState.departDate}
                    onChange={(e) => setSearchState((prev) => ({ ...prev, departDate: e.target.value }))}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="w-full">
                <label className="text-sm font-medium text-gray-700">Return Date</label>
                <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                  <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-3 flex-shrink-0" />
                  <input
                    type="date"
                    value={searchState.returnDate}
                    onChange={(e) => setSearchState((prev) => ({ ...prev, returnDate: e.target.value }))}
                    className="w-full bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              <div className="w-full flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Cabin Class</label>
                  <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                    <FontAwesomeIcon icon={faUser} className="text-gray-500 mr-3 flex-shrink-0" />
                    <select
                      value={searchState.cabinClass}
                      onChange={handleCabinClassChange}
                      className="w-full bg-transparent focus:outline-none appearance-none"
                    >
                      <option value="ECONOMY">Economy</option>
                      <option value="PREMIUM_ECONOMY">Premium Economy</option>
                      <option value="BUSINESS">Business</option>
                      <option value="FIRST">First Class</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  className="self-end bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!searchState.fromId || !searchState.toId || !searchState.departDate || loading}
                >
                  {loading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <span>Search</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="flight-content" className="px-6 py-10 bg-gray-100 rounded-t-[30px] w-full -translate-y-12">
        <div className="container mx-auto">
          <div className="md:hidden sticky top-4 z-50 mb-4 flex justify-end">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div
              className={`w-full md:w-1/4 bg-white p-6 rounded-lg shadow-md fixed md:static transform ${
                isFilterOpen ? 'translate-x-0' : '-translate-x-full'
              } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
              style={{ top: '0', left: '0', height: '100vh', overflowY: 'auto' }}
            >
              <h2 className="text-xl font-bold mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Airlines</label>
                  <div className="mt-2 space-y-2">
                    {[...new Set(flights.map((flight) => flight.airlineName))].map((airline) => (
                      <label key={airline} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedAirlines.includes(airline)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAirlines([...selectedAirlines, airline]);
                            } else {
                              setSelectedAirlines(selectedAirlines.filter((a) => a !== airline));
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>{airline}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Price Range</label>
                  <div className="mt-2">
                    <input
                      type="range"
                      min={0}
                      max={Math.max(...flights.map((f) => f.price.amount), 2000)}
                      step={10}
                      value={priceRange}
                      onChange={(e) => setPriceRange(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>$0</span>
                      <span>${priceRange}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cabin Class</label>
                  <select
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={searchState.cabinClass}
                    onChange={handleCabinClassChange}
                  >
                    <option value="ECONOMY">Economy</option>
                    <option value="PREMIUM_ECONOMY">Premium Economy</option>
                    <option value="BUSINESS">Business</option>
                    <option value="FIRST">First Class</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="w-full md:w-3/4">
              {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">{error}</div>}

              {/* Flight Results */}
              <div className="grid gap-6">
                {filteredFlights.map((flight) => (
                  <div
                    key={flight.id}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow border border-gray-200"
                  >
                    {/* Best Deal Ribbon */}
                    <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      Best Deal
                    </div>

                    {/* Airline & Flight Route Info */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {flight.airlineLogo && (
                          <img
                            src={flight.airlineLogo}
                            alt={flight.airlineName}
                            className="w-16 h-16 object-contain rounded-md shadow-md"
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{flight.airlineName}</h3>
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FontAwesomeIcon icon={faExchangeAlt} />
                            <span className="font-medium">
                              {flight.departureName} → {flight.arrivalName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold text-green-600">{flight.price.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{flight.price.currency}</p>
                      </div>
                    </div>

                    {/* Flight Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-6 border-t pt-4">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faPlaneDeparture} className="text-blue-500" />
                        <div>
                          <p className="font-semibold text-gray-600">Departure</p>
                          <p className="text-gray-800">
                            {new Date(flight.departureTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            - {flight.departureName} ({flight.departureIata})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faPlaneArrival} className="text-green-500" />
                        <div>
                          <p className="font-semibold text-gray-600">Arrival</p>
                          <p className="text-gray-800">
                            {new Date(flight.arrivalTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            - {flight.arrivalName} ({flight.arrivalIata})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-purple-500" />
                        <div>
                          <p className="font-semibold text-gray-600">Duration</p>
                          <p className="text-gray-800">{flight.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faChair} className="text-orange-500" />
                        <div>
                          <p className="font-semibold text-gray-600">Cabin Class</p>
                          <p className="text-gray-800 capitalize">{flight.cabinClass.toLowerCase()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-6">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-indigo-500" />
                        <div>
                          <p className="font-semibold text-gray-600">Seats Available</p>
                          <p className="text-gray-800">{flight.seatAvailability} left</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faSuitcase} className="text-red-500" />
                        <div>
                          <p className="font-semibold text-gray-600">Checked Baggage</p>
                          <p className="text-gray-800">{flight.baggage.checked}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faBriefcase} className="text-blue-500" />
                        <div>
                          <p className="font-semibold text-gray-600">Cabin Baggage</p>
                          <p className="text-gray-800">{flight.baggage.cabin}</p>
                        </div>
                      </div>

                      {flight.layovers.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faExchangeAlt} className="text-yellow-500" />
                          <div>
                            <p className="font-semibold text-gray-600">Layovers</p>
                            <p className="text-gray-800">{flight.layovers.join(', ')}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-green-600 font-semibold">Direct Flight</div>
                      )}
                    </div>

                    {/* Book Now Button */}
                    <div className="flex justify-end items-center border-t pt-4">
                      <button
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-xl transition flex items-center gap-2 text-lg font-semibold"
                        onClick={() => window.open(flight.bookingLink, '_blank')}
                      >
                        <FontAwesomeIcon icon={faDollarSign} />
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Flight;