import '../../index.css';
import Header from '../Cruise/CruiseHeader';
import HeaderBg from '../HeaderBg';
import CarDetail from '../Car_Rental/CarDetail';
import AdsScroller from '../Car_Rental/AdsScroller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getDetailsOfCars } from '../../api/CarService';
import "jquery-ui/ui/widgets/autocomplete";
import Footer from '../Dashboard/Footer';
import SubscriptionSection from '../Dashboard/SubscriptionSection';
import { useLocation } from 'react-router-dom';

// Main Page of Car Rental

const CarRental = () => {
    const location = useLocation();
    const user = location.state.original.userData;
    const [loading, setLoading] = useState(false);
    
    const [userData, setUserData] = useState(user);
    const [newFilteredCarData, setNewFilteredCarData] = useState([]);
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
    const [pickupValue, setPickupValue] = useState('');
    const [dropoffValue, setDropoffValue] = useState('');
    const [data, setData] = useState([]);
    const [dayDifference, setDayDifference] = useState(0);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    
    const toggleFilterVisibility = () => { setIsFilterVisible(!isFilterVisible); };

     // Pickup+Dropoff Date and Time 
    const [puTimeValue, setPuTimeValue] = useState(() => { return new Date().toLocaleTimeString('it-IT', { hour12: false, hour: '2-digit', minute: '2-digit' });});
    const [puDateValue, setPuDateValue] = useState(() => { const today = new Date(); return today.toISOString().split('T')[0]; });
    const [doTimeValue, setDoTimeValue] = useState(() => { return new Date().toLocaleTimeString('it-IT', { hour12: false, hour: '2-digit', minute: '2-digit' }); });
    const [doDateValue, setDoDateValue] = useState(() => { const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7)); return nextWeek.toISOString().split('T')[0]; });
    
    const handlePUDateValue = (event) => {
        const date = event.target.value;
        setPuDateValue(date);
        setCarDetail({
        ...carDetail,
        [event.target.name]: event.target.value
    })

    console.log(carDetail);
    }
    const handlePUTimeValue = (event) =>{
        const customTime = event.target.value;
        setPuTimeValue(customTime);
        setCarDetail({
          ...carDetail,
          [event.target.name]: event.target.value
        })
    
        console.log(carDetail);
    }
    const handleDODateValue = (event) => {
        const date = event.target.value;
        setDoDateValue(date);
        setCarDetail({
          ...carDetail,
          [event.target.name]: event.target.value
        })
    
        console.log(carDetail);
    }
    const handleDOTimeValue = (event) => {
        const customTime = event.target.value;
        setDoTimeValue(customTime);
        setCarDetail({
          ...carDetail,
          [event.target.name]: event.target.value
        })
    
        console.log(carDetail);
    }

    const [carDetail, setCarDetail] = useState({
        pickupCity: '',
        dropOffCity: '',
        pickupDate: '',
        pickupTime: '',
        dropOffDate: '',
        dropOffTime: '',
        carType: '',
        driverAge: '',
    });

    useEffect(() => {
        if (location.state?.original?.formCarData) {
            const formData = location.state.original.formCarData;
            console.log("hello CarRental: ", location.state.original.formCarData);
            
            setPickupValue(formData.pickup);
            setDropoffValue(formData.dropoff);
            setPuDateValue(formData.fromDate);
            setDoDateValue(formData.toDate);
            setPuTimeValue(formData.fromTime);
            setDoTimeValue(formData.toTime);
            setCarDetail(prev => ({
              pickupCity: formData.pickup,
              dropOffCity: formData.dropoff,
              pickupTime: formData.fromTime,
              dropOffTime: formData.toTime,
              pickupDate: formData.fromDate,
              dropOffDate: formData.toDate,
              carType: formData.carType,
              driverAge: formData.driverAge
          }));
        }
    }, [location.state?.original?.formCarData]); 

    
    const handleFormSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
    
        const pickupDate = new Date(carDetail.pickupDate);
        const dropOffDate = new Date(carDetail.dropOffDate);
        const timeDifference = dropOffDate - pickupDate;
        const dayDifference = timeDifference / (1000 * 3600 * 24);
    
        if (isNaN(dayDifference)) {
            console.error("Invalid date calculation. Aborting API call.");
            return;
        }
    
        setDayDifference(dayDifference);
    
        try {
            const response = await getDetailsOfCars(carDetail);
            console.log("API response:", response);
            setData(response);
            setNewFilteredCarData(response.data);
        } catch (error) {
            console.error("Error fetching car details:", error);
        } finally {
          setLoading(false);
        }
    };

    ////////////////////////////////////////////////////////////////
      
    // Utilize Data 
    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        setCarDetail({
          ...carDetail,
          [name]: value,
        });
    
        console.log(carDetail); 
    };
    
      // Jquery autocomplete 
    const fetchSuggestions = async (query, setSuggestions) => {
        try {
          const response = await axios.get(
            `https://secure.geonames.org/searchJSON`,
            {
              params: {
                q: query,
                maxRows: 10,
                username: 'HtetMyetZaw',
              },
            }
          );
          setSuggestions(response.data.geonames.map((item) => item.name));
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
    };
    const handlePickupChange = (e) => {
        const value = e.target.value;
        setPickupValue(value);
        if (value.length > 2) { fetchSuggestions(value, setPickupSuggestions); } 
          else { setPickupSuggestions([]); }
    };
    const handleDropoffChange = (e) => {
        const value = e.target.value;
        setDropoffValue(value);
        if (value.length > 2) { fetchSuggestions(value, setDropoffSuggestions); } 
          else { setDropoffSuggestions([]); }
    };
    
    useEffect(() => {
        setCarDetail((prev) => ({
            ...prev,
            dropOffCity: dropoffValue,
        }))
    }, [dropoffValue])
    
    useEffect(() => {
        setCarDetail((prev) => ({
            ...prev,
            pickupCity: pickupValue,
        }))
    }, [pickupValue])

    ///// Filtering data /////////
    const filterData = ((data) => {
        const priceFilter = {
            first: data.filter(car => parseFloat(car.price) > 200 && parseFloat(car.price) <= 300).length,
            second: data.filter(car => parseFloat(car.price) > 300 && parseFloat(car.price) <= 400).length,
            third: data.filter(car => parseFloat(car.price) > 400 && parseFloat(car.price) <= 500).length,
            fourth: data.filter(car => parseFloat(car.price) > 500 && parseFloat(car.price) <= 600).length,
            fifth: data.filter(car => parseFloat(car.price) > 600).length
        }

        const typeFilter = {
            Mini: data.filter(car => car.group === 'Mini').length,
            Economy: data.filter(car => car.group === 'Economy').length,
            Compact: data.filter(car => car.group === 'Compact').length,
            Intermediate: data.filter(car => car.group === 'Intermediate').length,
            Standard: data.filter(car => car.group === 'Standard').length,
            Full_size: data.filter(car => car.group === 'Full-size').length,
        }

        const reviewFilter = {
            super: data.filter(car => parseFloat(car.avg_rating) >= 9).length,
            vgood: data.filter(car => parseFloat(car.avg_rating) >= 8).length,
            good: data.filter(car => parseFloat(car.avg_rating) >= 7).length,
        }

        return { priceFilter, typeFilter, reviewFilter };
    });

    const [activeFilters, setActiveFilters] = useState({
        rating: null,
        price: null,
        type: null,
    });

    useEffect(() => {
        console.log("newfilteredCarData is ", newFilteredCarData);
    }, [newFilteredCarData]);

    const { priceFilter, typeFilter, reviewFilter } = newFilteredCarData
    ? filterData(newFilteredCarData)
    : { priceFilter: {}, typeFilter: {}, reviewFilter: {} };
        
    const extractCarOnFilter = (categoryName, categoryValue) => (event) => {
        const isChecked = event.target.checked;
    
        const updatedFilters = {
            ...activeFilters, [categoryName]: isChecked ? categoryValue : null,
        };
    
        setActiveFilters(updatedFilters);
    
        let updatedData = data?.data || [];
    
        Object.keys(updatedFilters).forEach((key) => {
            if (updatedFilters[key]) {
            if (key === "rating") {
                if (updatedFilters[key] === "super") {
                updatedData = updatedData.filter((car) => car.rating >= 9);
                } else if (updatedFilters[key] === "vgood") {
                updatedData = updatedData.filter((car) => car.rating >= 8);
                } else if (updatedFilters[key] === "good") {
                updatedData = updatedData.filter((car) => car.rating >= 7);
                }
            } else if (key === "price") {
                if (updatedFilters[key] === "200-300") {
                updatedData = updatedData.filter(
                    (car) => car.price >= 200 && car.price <= 300
                );
                } else if (updatedFilters[key] === "300-400") {
                updatedData = updatedData.filter(
                    (car) => car.price > 300 && car.price <= 400
                );
                } else if (updatedFilters[key] === "400-500") {
                updatedData = updatedData.filter(
                    (car) => car.price > 400 && car.price <= 500
                );
                } else if (updatedFilters[key] === "500-600") {
                updatedData = updatedData.filter(
                    (car) => car.price > 500 && car.price <= 600
                );
                } else if (updatedFilters[key] === "600") {
                updatedData = updatedData.filter(
                    (car) => car.price > 600
                );
                }
            } else if (key === "type") {
                if (updatedFilters[key] === "Mini") {
                    updatedData = updatedData.filter(
                        (car) => car.group === "Mini"
                    );
                } else if (updatedFilters[key] === "Economy") {
                    updatedData = updatedData.filter(
                        (car) => car.group === "Economy"
                    );
                } else if (updatedFilters[key] === "Compact") {
                    updatedData = updatedData.filter(
                        (car) => car.group === "Compact"
                    );
                } else if (updatedFilters[key] === "Intermediate") {
                    updatedData = updatedData.filter(
                        (car) => car.group === "Intermediate"
                    );
                } else if (updatedFilters[key] === "Standard") {
                    updatedData = updatedData.filter(
                        (car) => car.group === "Standard"
                    );
                } else if (updatedFilters[key] === "Full-size") {
                    updatedData = updatedData.filter(
                        (car) => car.group === "Full-size"
                    );
                }
            }
            }
        });
    
        setNewFilteredCarData(updatedData);
        };

    return (
        <>
        <Header user={userData}/>
        <HeaderBg title={"Car Rental"} flag={false}/>
        
        <form onSubmit={handleFormSubmit} id="input-box" className="mx-4 sm:mx-8 lg:mx-12 px-6 -mt-28 relative">
        <div className="bg-white rounded-xl shadow-lg px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-6">
                {/* Pickup Location */}
                <div className="border w-full flex items-center justify-between p-4 rounded-lg">
                    <div className="flex-1">
                    <label className="block text-gray-600/75 text-xs font-bold mb-1">Pickup Location</label>
                    <input type="text" required placeholder="Enter pickup location" name="pickupCity" id="pickupCity" value={pickupValue}
                        onChange={handlePickupChange} className="w-full bg-gray-50 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-slate-700"/>

                    {pickupSuggestions.length > 0 && (
                        <ul className="suggestion-box">
                        {pickupSuggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => {
                            setPickupValue(suggestion);
                            setPickupSuggestions([]);
                            }} >
                            {suggestion}
                            </li>
                        ))}
                        </ul>
                    )}
                    </div>
                </div>
                
                {/* Dropoff Location */}
                <div className="border w-full flex items-center justify-between p-4 rounded-lg">
                    <div className="flex-1">
                    <label className="block text-gray-600/75 text-xs font-bold mb-1">Dropoff Location</label>
                    <input type="text" required placeholder="Enter dropoff location" name="dropOffCity" id="dropoffCity" value={dropoffValue}
                        onChange={handleDropoffChange} className="w-full bg-gray-50 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-slate-700"/>
                    {dropoffSuggestions.length > 0 && (
                        <ul className="suggestion-box">
                        {dropoffSuggestions.map((suggestion, index) => (
                            <li key={index} onClick={() => {
                                setDropoffValue(suggestion);
                                setDropoffSuggestions([]);
                            }} >
                            {suggestion}
                            </li>
                        ))}
                        </ul>
                    )}
                    </div>
                </div>

                {/* Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                    {/* Pickup Time */}
                    <div className="border rounded-lg p-5 text-xs">
                    <label className="block text-gray-600/75 font-bold mb-2">Pickup Time</label>
                    <div className="flex flex-col space-y-1">
                        <div>
                        <input type="date" required name="pickupDate" id='pickupDate' className="font-bold text-sm bg-transparent border-none text-gray-700 focus:outline-none w-full appearance-none"
                            min={new Date().toISOString().split('T')[0]} value={puDateValue} onChange={handlePUDateValue}/>
                        </div>
                        <div className="h-[1px] bg-gray-300"></div> 
                        <div>
                        <input type="time" name="pickupTime" className="font-bold text-sm bg-transparent border-none text-gray-700 focus:outline-none w-full appearance-none"
                            min={puDateValue === new Date().toISOString().split('T')[0] ? new Date().toLocaleTimeString('it-IT', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '00:00'}
                            value={puTimeValue} onChange={handlePUTimeValue}/>
                        </div>
                    </div>
                    </div>
        
                    {/* Dropoff Time */}
                    <div className="border rounded-lg p-5 text-xs">
                    <label className="block text-gray-600/75 font-bold mb-2">Dropoff Time</label>
                    <div className="flex flex-col space-y-1"> 
                        <div>
                        <input type="date" required name="dropOffDate" className="font-bold text-sm bg-transparent border-none text-gray-700 focus:outline-none w-full appearance-none"
                            min={new Date().toISOString().split('T')[0]} value={doDateValue} onChange={handleDODateValue}/>
                        </div>
                        <div className="h-[1px] bg-gray-300"></div> 
                        <div>
                        <input type="time" name="dropOffTime" className="font-bold text-sm bg-transparent border-none text-gray-700 focus:outline-none w-full appearance-none"
                            min={doDateValue === new Date().toISOString().split('T')[0] ? new Date().toLocaleTimeString('it-IT', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '00:00'}
                            value={doTimeValue} onChange={handleDOTimeValue}/>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Additional Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
                    <div className="w-full">
                    {/* Car Categories */}
                    <label className="block text-gray-600 font-semibold text-sm mb-2">Car Categories</label>
                    <div className="relative">
                        <select name="carType" value={carDetail.carType} onChange={handleSelectChange} className="appearance-none w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                        <option value="">Select car type</option>
                        <option value="Economy">Economy</option>
                        <option value="Compact">Compact</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Standard">Standard</option>
                        <option value="Full-size">Full-size</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        </div>
                    </div>

                    {/* Air Con */}
                    <div className="mt-4">
                        <label className="inline-flex items-center">
                        <input type="checkbox" checked name="hasAirConditioning" className="form-checkbox text-blue-500 border-gray-300 rounded-md focus:ring-blue-400" />
                        <span className="ml-2 text-gray-600 font-semibold text-sm">Has Air Conditioning</span>
                        </label>
                    </div>
                    </div> 

                    <div className="w-full">
                    {/* Driver Age */}
                    <label className="block text-gray-600 font-semibold text-sm mb-2">Driver's Age</label>
                    <div className="relative">
                        <select name="driverAge" value={carDetail.driverAge} onChange={handleSelectChange} className="appearance-none w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
                        <option value="25">20+</option>
                        <option value="35">30+</option>
                        <option value="45">40+</option>
                        <option value="50">50+</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        </div>
                    </div>

                    {/* Transmission */}
                    <div className="mt-4">
                        <label className="inline-flex items-center">
                        <input type="checkbox" checked name="transmission" className="form-checkbox text-blue-500 border-gray-300 rounded-md focus:ring-blue-400" />
                        <span className="ml-2 text-gray-600 font-semibold text-sm">AUTO Transmission</span>
                        </label>
                    </div>
                    </div>
                </div>

                <div></div>

                {/* Search Button */}
                <div className="flex justify-end">
                    <button disabled={loading}
                     className="flex max-w-48 items-center rounded-md bg-slate-800 py-2 px-6 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="submit">
                        
                        {loading ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                            <span>Searching...</span>
                          </>
                        ) : (
                          <> 
                            <FontAwesomeIcon icon={faSearch} className='mr-2'/>
                            Search Cars
                          </>
                        )}
                    </button>
                </div>
            </div>
        </div>
        </form>

        {/* Banner */}
        <div class="h-auto md:h-44 my-8 md:my-16 flex flex-col md:flex-row w-full bg-slate-100 rounded-lg p-4 md:p-0">
            {/* First Section */}
            <div className='w-full md:w-1/3 text-center flex flex-row items-center justify-center mb-4 md:mb-0'>
                <img src="images/24-hours-support.png" alt="we're here" className='w-16 h-16 md:w-24 md:h-24 mr-3 md:mr-5'/>
                <div className='text-left'>
                    <p className='font-poppins text-base md:text-lg font-semibold'> We're here for you </p>
                    <p className='text-xs font-light'> Customer support in over 30 languages </p>
                </div>
            </div>

            {/* Second Section */}
            <div className='w-full md:w-1/3 text-center flex flex-row items-center justify-center mb-4 md:mb-0'>
                <img src="images/planning.png" alt="we're here" className='w-16 h-16 md:w-24 md:h-24 mr-3 md:mr-5'/>
                <div className='text-left'>
                    <p className='font-poppins text-base md:text-lg font-semibold'> Free cancellation </p>
                    <p className='text-xs font-light'> Up to 48 hours before pick-up for most bookings </p>
                </div>
            </div>

            {/* Third Section */}
            <div className='w-full md:w-1/3 text-center flex flex-row items-center justify-center'>
                <img src="images/like-comment.png" alt="we're here" className='w-16 h-16 md:w-24 md:h-24 mr-3 md:mr-5'/>
                <div className='text-left'>
                    <p className='font-poppins text-base md:text-lg font-semibold'> 5 million+ reviews </p>
                    <p className='text-xs font-light'> By real, verified customers </p>
                </div>
            </div>
        </div>

        {/* Data Display */}
        <div className="flex flex-col md:flex-row md:space-x-8 p-4 mx-2 md:p-8 my-7">
            {/* Filtered Data Display */}
            <div className=' flex flex-col space-y-6 w-full md:w-72'>
                <div className="w-full md:w-72 p-4 md:p-8 rounded-lg shadow-md bg-white space-y-6 hidden md:block">
                    {/* Pickup Location */}
                    <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <i className="fa-solid fa-location-arrow"></i>
                        <span className="text-xs">Pickup Location</span>
                    </div>
                    <div className="px-2 py-1 text-sm font-semibold bg-gray-100 rounded-md">
                        {carDetail.pickupCity}
                    </div>
                    </div>

                    {/* Dropoff Location */}
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                        <i className="fa-solid fa-location-arrow"></i>
                        <span className="text-xs">Dropoff Location</span>
                        </div>
                        <div className="px-2 py-1 text-sm font-semibold bg-gray-100 rounded-md">
                        {carDetail.dropOffCity}
                        </div>
                    </div>

                    {/* Pickup Time */}
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                        <i className="fa-solid fa-calendar-clock"></i>
                        <span className="font-semibold text-xs">Pickup Time</span>
                        </div>
                        <div className="flex justify-between items-center px-2 py-1 text-sm font-semibold bg-gray-100 rounded-md">
                        <span className="text-gray-700">{puDateValue}</span>
                        <div className="w-px bg-black h-4 mx-2"></div>
                        <span className="text-gray-700">{puTimeValue}</span>
                        </div>
                    </div>

                    {/* Dropoff Time */}
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <i className="fa-solid fa-calendar-clock"></i>
                        <span className="font-semibold text-xs">Dropoff Time</span>
                        </div>
                        <div className="flex justify-between px-2 py-1 text-sm font-semibold bg-gray-100 rounded-md">
                            <span className="text-gray-700">{doDateValue}</span>
                        <div className="w-px bg-black h-4 mx-2"></div>
                            <span className="text-gray-700">{doTimeValue}</span>
                        </div>
                    </div>
                </div>

                {newFilteredCarData.length > 0 && (
                    <div>
                    <button onClick={toggleFilterVisibility}
                      className="md:hidden w-full p-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg mb-4 shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
                    </button>
          
                    {/* Filter Section Content */}
                    <div id="filter-section"
                        className={`w-full md:w-72 p-4 md:p-8 rounded-lg shadow-md bg-white transition-all duration-300 overflow-hidden ${
                          isFilterVisible ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 md:max-h-screen md:opacity-100'
                        }`}
                      >
                      <div className='flex justify-between items-center'>
                        <h3 className='text-lg font-poppins font-semibold'> Filter </h3>
                        <p className='text-blue-500 text-xs text-right font-poppins'> Clear all filter </p>
                      </div>
                      <hr className='my-5 border-t-1 border-gray-300'/>
          
                      {/* Price Filter */}
                      <div className='space-y-1'>
                        <h3 className='text-sm font-poppins font-semibold'> Price </h3>
                        <div className='flex flex-col space-y-1'>
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input type="checkbox" name="firstRange" checked={activeFilters.price === "200-300"} onChange={() => extractCarOnFilter("price", "200-300")}  />
                              <span className="text-sm font-poppins ml-2"> $200 - $300</span>
                            </div>
                            <p className="text-xs font-poppins font-semibold">{priceFilter.first}</p>
                          </label>
          
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input type="checkbox" name="secondRange" checked={activeFilters.price === "300-400"} onChange={() => extractCarOnFilter("price", "300-400")} />
                              <span className="text-sm font-poppins ml-2"> $300 - $400</span>
                            </div>
                            <p className="text-xs font-poppins font-semibold">{priceFilter.second}</p>
                          </label>
          
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input type="checkbox" name="thirdRange" checked={activeFilters.price === "400-500"} onChange={() => extractCarOnFilter("price", "400-500")} />
                              <span className="text-sm font-poppins ml-2"> $400 - $500</span>
                            </div>
                            <p className="text-xs font-poppins font-semibold">{priceFilter.third}</p>
                          </label>
          
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="fourthRange"
                                checked={activeFilters.price === "500-600"}
                                onChange={() => extractCarOnFilter("price", "500-600")}
                              />
                              <span className="text-sm font-poppins ml-2"> $500 - $600</span>
                            </div>
                            <p className="text-xs font-poppins font-semibold">{priceFilter.fourth}</p>
                          </label>
          
                          <label className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="fifthRange"
                                checked={activeFilters.price === "600"}
                                onChange={() => extractCarOnFilter("price", "600")}
                              />
                              <span className="text-sm font-poppins ml-2">$600+</span>
                            </div>
                            <p className="text-xs font-semibold font-poppins">{priceFilter.fifth}</p>
                          </label>
                        </div>
                      </div>
                      <hr className='my-5 border-t-1 border-gray-300'/>
          
                      {/* Review Score Filter */}
                      <div className='space-y-1'>
                        <h3 className='text-sm font-poppins font-semibold'> Review Score </h3>
                        <div className='flex flex-col space-y-1'>
                          <label className="flex items-center justify-between"> 
                            <div className="flex items-center">
                              <input type="checkbox" name="super" checked={activeFilters.rating === "super"} onChange={() => extractCarOnFilter("rating", "super")} />
                              <span className="text-sm font-poppins ml-2">Super : 9+</span>
                            </div>
                            <p className="text-xs font-semibold font-poppins">{reviewFilter.super}</p>
                          </label>
                          <label className="flex items-center justify-between"> 
                            <div className="flex items-center">
                              <input type="checkbox" name="vgood" checked={activeFilters.rating === "vgood"} onChange={() => extractCarOnFilter("rating", "vgood")} />
                              <span className="text-sm font-poppins ml-2">Very good : 8+</span>
                            </div>
                            <p className="text-xs font-semibold font-poppins">{reviewFilter.vgood}</p>
                          </label>
                          <label className="flex items-center justify-between"> 
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="good"
                                checked={activeFilters.rating === "good"}
                                onChange={() => extractCarOnFilter("rating", "good")} 
                              />
                              <span className="text-sm font-poppins ml-2">Good : 7+</span>
                            </div>
                            <p className="text-xs font-semibold font-poppins">{reviewFilter.good}</p>
                          </label>
                        </div>
                      </div>
                      <hr className='my-5 border-t-1 border-gray-300'/>
          
                      {/* Car Categories Filter */}
                      <div className='space-y-1'>
                        <h3 className='text-sm font-poppins font-semibold'> Car Categories </h3>
                        <div className='flex flex-col space-y-1'>
                          <label className="flex items-center justify-between"> 
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="mini"
                                checked={activeFilters.type === "Mini"}
                                onChange={() => extractCarOnFilter("type", "Mini")} 
                              />
                              <span className="text-sm font-poppins ml-2">Mini</span>
                            </div>
                            <p className="text-xs font-semibold font-poppins">{typeFilter.Mini}</p>
                          </label>
                          <label className="flex items-center justify-between"> 
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="economy"
                                checked={activeFilters.type === "Economy"}
                                onChange={() => extractCarOnFilter("type", "Economy")} 
                              />
                              <span className="text-sm font-poppins ml-2">Economy</span>
                            </div>
                            <p className="text-xs font-semibold font-poppins">{typeFilter.Economy}</p>
                          </label>
                          <label className="flex items-center justify-between"> 
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                name="compact"
                                checked={activeFilters.type === "Compact"}
                                onChange={() => extractCarOnFilter("type", "Compact")}
                              />
                              <span className="text-sm font-poppins ml-2">Compact</span>
                            </div>
                            <p className="text-xs font-semibold font-poppins">{typeFilter.Compact}</p>
                          </label>
                          <label className="flex items-center justify-between"> 
                            <div className="flex items-center">
                              <input type="checkbox" name="Intermediate" checked={activeFilters.type === "Intermediate"} onChange={() => extractCarOnFilter("type", "Intermediate")} />
                              <span className="text-sm font-poppins ml-2">Intermediate</span>
                            </div>
                            <p className="text-xs font-semibold font-poppins">{typeFilter.Intermediate}</p>
                          </label>
                          <label className="flex items-center justify-between"> 
                            <div className="flex items-center">
                              <input type="checkbox" name="standard" checked={activeFilters.type === "Standard"} onChange={() => extractCarOnFilter("type", "Standard")}  />
                              <span className="text-sm font-poppins ml-2">Standard</span>
                            </div>
                            <p className="text-xs font-semibold font-poppins">{typeFilter.Standard}</p>
                          </label>
                          <label className="flex items-center justify-between"> 
                            <div className="flex items-center">
                              <input type="checkbox" name="full_size" checked={activeFilters.type === "Full-size"} onChange={() => extractCarOnFilter("type", "Full-size")}  />
                              <span className="text-sm font-poppins ml-2">Full-size</span>
                            </div>
                            <p className="text-xs font-semibold font-poppins">{typeFilter.Full_size}</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                
            </div>

            {/* Car Result Display */}
            <div className="space-y-4 flex-1">
                <AdsScroller />
                <CarDetail className="w-full" userData={userData} data={newFilteredCarData} fromDate={carDetail.pickupDate} toDate={carDetail.dropOffDate} dayDifference={dayDifference}/>
            </div>
        </div>

        <div className={data.length === 0 ? 'mt-[600px]' : ''}>
            <SubscriptionSection />
            <Footer />
        </div>
            
        </>
    )
}

export default CarRental