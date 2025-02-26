import '../../index.css';
import Header from '../Header';
import HeaderBg from '../HeaderBg';
import CarDetail from '../Car_Rental/CarDetail';
import AdsScroller from '../Car_Rental/AdsScroller';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getDetailsOfCars } from '../../api/CarService';
import "jquery-ui/ui/widgets/autocomplete";
import FilterSection from './FilterSection';

// Main Page of Car Rental

const CarRental = () => {
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

    const [currentCarDetail, setCurrentCarDetail] = useState(() => {
        const storedDetails = sessionStorage.getItem('carDetail');
        return storedDetails ? JSON.parse(storedDetails) : {
            pickupCity: '',
            dropOffCity: '',
            pickupDate: '',
            pickupTime: '',
            dropOffDate: '',
            dropOffTime: '',
            carType: '',
            driverAge: '',
        };
    });

    // For Storing in SessionStorage for FilterCard Counts
    const [orgDataFromAPI, setOrgDataFromAPI] = useState(() => {
        const orgData = sessionStorage.getItem('carDataFromAPI');
        return orgData ? JSON.parse(orgData) : [];
    })

    const [newFilteredCarData, setNewFilteredCarData] = useState([]);
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [dropoffSuggestions, setDropoffSuggestions] = useState([]);
    const [pickupValue, setPickupValue] = useState('');
    const [dropoffValue, setDropoffValue] = useState('');
    const [data, setData] = useState([]);
    const [dayDifference, setDayDifference] = useState(0);
    
    // Pickup+Dropoff Date and Time 
    const [puTimeValue, setPuTimeValue] = useState(() => {
        return new Date().toLocaleTimeString('it-IT', { hour12: false, hour: '2-digit', minute: '2-digit' });
    });
    const [puDateValue, setPuDateValue] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    });
    const [doTimeValue, setDoTimeValue] = useState(() => {
    return new Date().toLocaleTimeString('it-IT', { hour12: false, hour: '2-digit', minute: '2-digit' });
    });
    const [doDateValue, setDoDateValue] = useState(() => {
    const nextWeek = new Date(new Date().setDate(new Date().getDate() + 7));
    return nextWeek.toISOString().split('T')[0];
    });
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
      
    // Utilize Data 
    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        setCarDetail({
          ...carDetail,
          [name]: value,
        });
    
        console.log(carDetail); 
    };
    
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log("Form submitted:", carDetail);

        const pickupDate = new Date(carDetail.pickupDate);
        const dropOffDate = new Date(carDetail.dropOffDate);
        const timeDifference = dropOffDate - pickupDate;
        const dayDifference = timeDifference / (1000 * 3600 * 24);
        setDayDifference(dayDifference);

        console.log("Day difference got at form submit:", dayDifference);

        try {
          const response = await getDetailsOfCars(carDetail);
          console.log("API response:", response);
      
          sessionStorage.setItem('carDetail', JSON.stringify(carDetail));
          setCurrentCarDetail(JSON.parse(sessionStorage.getItem('carDetail')));

          setData(response); // Update data state
          sessionStorage.setItem('carDataFromAPI', JSON.stringify(response.data));
          setOrgDataFromAPI(JSON.parse(sessionStorage.getItem('carDataFromAPI')));

          setNewFilteredCarData(response.data);
      
          // Reset carDetail for the form
          setCarDetail({
            pickupCity: '',
            dropOffCity: '',
            pickupDate: '',
            pickupTime: '',
            dropOffDate: '',
            dropOffTime: '',
            carType: '',
            driverAge: '',
          });
        } catch (error) {
          console.log("Error fetching car details:", error);
        }
    };
      
    useEffect(() => {
        console.log("Data state updated:", data);
    }, [data]);

    useEffect(() => {
        console.log("Got a new filtered data: ", newFilteredCarData);
    }, [newFilteredCarData]);

    // Clearing session
    useEffect(() => {
        const handleBeforeUnload = () => {
            sessionStorage.clear();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    
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

    {/* Filtering Data */}
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

    const { priceFilter, typeFilter, reviewFilter } = orgDataFromAPI
        ? filterData(orgDataFromAPI)
        : { priceFilter: {}, typeFilter: {}, reviewFilter: {} };

    
    const [activeFilters, setActiveFilters] = useState({
        rating: null,
        price: null,
        type: null,
    });

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

    useEffect(() => {
        console.log("Filtered data for component:", newFilteredCarData);
    }, [newFilteredCarData]);

    return (
        <>
        <Header />
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
                        <select name="carType" onChange={handleSelectChange} className="appearance-none w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
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
                        <input type="checkbox" name="hasAirConditioning" className="form-checkbox text-blue-500 border-gray-300 rounded-md focus:ring-blue-400" />
                        <span className="ml-2 text-gray-600 font-semibold text-sm">Has Air Conditioning</span>
                        </label>
                    </div>
                    </div> 

                    <div className="w-full">
                    {/* Driver Age */}
                    <label className="block text-gray-600 font-semibold text-sm mb-2">Driver's Age</label>
                    <div className="relative">
                        <select name="driverAge" onChange={handleSelectChange} className="appearance-none w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400">
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
                        <input type="checkbox" name="transmission" className="form-checkbox text-blue-500 border-gray-300 rounded-md focus:ring-blue-400" />
                        <span className="ml-2 text-gray-600 font-semibold text-sm">AUTO Transmission</span>
                        </label>
                    </div>
                    </div>
                </div>

                <div></div>

                {/* Search Button */}
                <div className="flex justify-end">
                    <button className="flex max-w-48 items-center rounded-md bg-slate-800 py-2 px-6 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 mr-1.5 text-white" fill="currentColor">
                        <path d="M135.2 117.4L109.1 192l293.8 0-26.1-74.6C372.3 104.6 360.2 96 346.6 96L165.4 96c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32l181.2 0c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2l0 144 0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L96 400l0 48c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-48L0 256c0-26.7 16.4-49.6 39.6-59.2zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm288 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
                        </svg>
                        <span className="pl-2 font-semibold text-sm"> Search Car </span>
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
                        {currentCarDetail.pickupCity}
                    </div>
                    </div>

                    {/* Dropoff Location */}
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                        <i className="fa-solid fa-location-arrow"></i>
                        <span className="text-xs">Dropoff Location</span>
                        </div>
                        <div className="px-2 py-1 text-sm font-semibold bg-gray-100 rounded-md">
                        {currentCarDetail.dropOffCity}
                        </div>
                    </div>

                    {/* Pickup Time */}
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                        <i className="fa-solid fa-calendar-clock"></i>
                        <span className="font-semibold text-xs">Pickup Time</span>
                        </div>
                        <div className="flex justify-between items-center px-2 py-1 text-sm font-semibold bg-gray-100 rounded-md">
                        <span className="text-gray-700">{currentCarDetail.pickupDate}</span>
                        <div className="w-px bg-black h-4 mx-2"></div>
                        <span className="text-gray-700">{currentCarDetail.pickupTime}</span>
                        </div>
                    </div>

                    {/* Dropoff Time */}
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <i className="fa-solid fa-calendar-clock"></i>
                        <span className="font-semibold text-xs">Dropoff Time</span>
                        </div>
                        <div className="flex justify-between px-2 py-1 text-sm font-semibold bg-gray-100 rounded-md">
                            <span className="text-gray-700">{currentCarDetail.dropOffDate}</span>
                        <div className="w-px bg-black h-4 mx-2"></div>
                            <span className="text-gray-700">{currentCarDetail.dropOffTime}</span>
                        </div>
                    </div>
                </div>

                <FilterSection orgDataFromAPI={orgDataFromAPI} currentCarDetail={currentCarDetail} activeFilters={activeFilters} extractCarOnFilter={extractCarOnFilter} priceFilter={priceFilter} reviewFilter={reviewFilter} typeFilter={typeFilter}/>

            </div>

            {/* Car Result Display */}
            <div className="space-y-4 flex-1">
                <AdsScroller />
                <CarDetail className="w-full" data={newFilteredCarData} fromDate={carDetail.pickupDate} toDate={carDetail.dropOffDate} dayDifference={dayDifference}/>
            </div>
        </div>
            
        </>
    )
}

export default CarRental