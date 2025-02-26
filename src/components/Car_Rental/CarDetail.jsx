import {React, useEffect, useState, useRef} from 'react';
import { Link } from 'react-router-dom';
import { checkPayment } from '../../api/CarService';


const CarDetail = ({ data, flag, dayDifference, fromDate, toDate }) => {

  console.log("Day difference got at component:", dayDifference);
  {/* Payment Backend Here */}
  const [paymentInput, setPaymentInput] = useState({
    'amount': "",
    'quantity': 0,
    'currency': "USD",
    'name': "",
    'multiplier': 100,
    'email': "hmzzzz2004@gmail.com",
    'user_id': 1,
    'status': "PAID",
    'transaction_date': ""
  });
  
  const handleInput = (e) => {
    const { name, value } = e.target;
    setPaymentInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  useEffect(() => {
    console.log(paymentInput);
  }, [paymentInput])

  const dialog_card = useRef();
  const [dialogData, setDialogData] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState('recommended');

  // Storing in sessionStorage
  useEffect(() => {
    console.log("Data caught: ", data)
    const originalCarData = data || [];
    if (originalCarData.length > 0) {
      sessionStorage.setItem('carData', JSON.stringify(originalCarData)); // Store in sessionStorage
      setFilteredData(originalCarData);
    }
  }, [data]);

  // Filtering with 3 tabs
  useEffect(() => {
    const storedCarData = JSON.parse(sessionStorage.getItem('carData')) || [];
    if (activeTab === 'low-to-high') {
      const sorted = [...storedCarData].sort((a, b) => a.price - b.price);
      setFilteredData(sorted);
    } else if (activeTab === 'high-to-low') {
      const sorted = [...storedCarData].sort((a, b) => b.price - a.price);
      setFilteredData(sorted);
    } else {
      setFilteredData(storedCarData);
    }
  }, [activeTab]);

  const handlePaymentSubmit = async (event, car) => {
    event.preventDefault();
  
    // Ensure dayDifference is at least 1
    const validDayDifference = Math.max(dayDifference, 1);
  
    const validPrice = Math.round(car.price * 100);
    const today = new Date();

    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split("T")[0]; // Converts to "yyyy-MM-dd"
  };
  
    // Directly use the valid data without relying on state update
    const paymentInfo = {
      amount: validPrice,
      name: car.name,
      quantity: validDayDifference,
      multiplier: 100,
      currency: 'USD',
      email: 'hmzzzz2004@gmail.com', // to replace with user's email
      user_id: 1, // to replace with user's id
      product_id: car.v_id,
      fromDate: formatDate,
      toDate: toDate,
      status: "PAID",
      category: "car",
      transaction_date: today.toISOString()
    };
  
    console.log("Payment input:", paymentInfo);
  
    try {
      console.log("Car data:", car); 
      const response = await checkPayment({
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
  };
  

  return (
    <>
      <div className='mb-5'>
        {filteredData && filteredData.length > 0 ? (
          <div className='space-y-4'>
            <div className="h-10 mr-8">
              <div className="w-full flex flex-row">
                <div
                  onClick={() => setActiveTab('recommended')}
                  className={`w-1/3 mx-2 py-2 px-4 text-center font-poppins text-sm shadow-sm rounded-xl cursor-pointer ${
                    activeTab === 'recommended' ? 'bg-sky-100 border border-sky-200' : 'bg-slate-100' }`} >
                  Recommended First <i class="fa-duotone fa-light fa-stars ml-2"></i>
                </div>
                <div 
                  onClick={() => setActiveTab('low-to-high')}
                  className={`w-1/3 mx-2 py-2 px-4 text-center font-poppins text-sm shadow-sm rounded-xl cursor-pointer ${
                    activeTab === 'low-to-high' ? 'bg-sky-100 border border-sky-200' : 'bg-slate-100' }`} >
                  Price Lowest - Highest <i class="fa-duotone fa-solid fa-arrow-down-short-wide ml-2"></i>
                </div>
                <div
                  onClick={() => setActiveTab('high-to-low')}
                  className={`w-1/3 mx-2 py-2 px-4 text-center font-poppins text-sm shadow-sm rounded-xl cursor-pointer ${
                    activeTab === 'high-to-low' ? 'bg-sky-100 border border-sky-200k' : 'bg-slate-100' }`} >
                  Price Highest - Lowest <i class="fa-duotone fa-solid fa-arrow-up-short-wide ml-2"></i>
                </div>
              </div>
            </div>         
            
            {filteredData.map((car, index) => (
              <div key={index} className='h-56 mr-8 bg-slate-50 rounded-lg flex flex-wrap shadow-md'>
                {/* Upper box */}
                <div className="upper-box w-full h-3/4 flex flex-row rounded-t-lg">

                  <div className='w-1/4 p-4 text-left flex flex-col'>
                    <span className="carType font-poppins text-xs"> {car.group} </span>
                    <span className="carType text-sm font-bold font-poppins"> {car.name.length > 17 ? `${car.name.substring(0, 17)}...` : car.name} </span>
                    <img src={car.img} alt="carPhoto" className='h-[98px] w-[153px]' />
                    <span className="location text-xs font-poppins">
                      <i className="fa-duotone fa-light fa-map-location pr-1"></i> {car.pickup.length > 19 ? `${car.pickup.substring(0, 19)}...` : car.pickup}
                    </span>
                  </div>

                  <div className='w-1/2 flex flex-row font-poppins text-xs'>
                    <div className='w-1/2 flex flex-row'>
                      <div id='box2.1.1' className='w-1/5 flex flex-row space-y-1 py-[21px]'>
                        <div className='w-1/2'>

                        </div>
                        <div id='icons' className='w-1/2 text-center flex flex-col space-y-2'>
                          <i class="fa-duotone fa-solid fa-person-seat"></i>
                          <i class="fa-duotone fa-light fa-suitcase text-[11px]"></i>
                          <i class="fa-duotone fa-solid fa-suitcase-rolling text-[11px]"></i>
                          <i class="fa-duotone fa-solid fa-car-side text-[10px]"></i>
                          <i class="fa-duotone fa-solid fa-snowflake text-[11px]"></i>
                          <i class="fa-duotone fa-solid fa-gears text-[11px]"></i>
                        </div>
                      </div>
                      <div id='box2.1.2' className='w-4/5 text-left py-6 px-2 flex flex-col'>
                        <div id="values" className='space-y-[3px]'>
                          <p className='text-[11px]'> {car.seats} Seats </p>
                          <p className='text-[11px]'> {car.bigCase} Large bag </p>
                          <p className='text-[11px]'> {car.smallCase} Small bags </p>
                          <p className='text-[11px]'> {car.doors} Doors </p>
                          <p className='text-[11px]'> Air-conditioning </p>
                          <p className='text-[11px]'> {car.transmission} Transmission </p>
                        </div>
                        
                      </div>
                    </div>
                    <div className='w-1/2 flex flex-row'>
                      <div id='box2.2.1' className='w-1/5 flex flex-row space-y-1 py-[21px]'>
                        <div className='w-1/2'>

                        </div>
                        <div id='icons' className='w-1/2 text-center flex flex-col space-y-2'>
                          <i class="fa-duotone fa-solid fa-gas-pump"></i>
                          <i class="fa-duotone fa-regular fa-check"></i>
                        </div>
                      </div>
                      <div id='box2.2.2' className='w-4/5 text-left py-6 px-2 flex flex-col'>
                        <div id="values" className='space-y-[3px]'>
                          <p className='text-[11px]'> Full to full </p>
                          <p className='text-[11px]'> Unlimited mileage </p>
                        </div>
                        
                      </div>
                    </div>
                  </div>

                  <div className='w-1/4'>
                    <div className='h-1/2 relative'>
                      <div className='absolute bottom-0 right-0 rounded-l-2xl bg-sky-700 h-1/3 w-2/3'>
                        <p className='text-center text-sm text-white py-1 font-semibold'>Great Deal</p>
                      </div>
                    </div>
                    <div className='h-1/2 relative'>
                      <div className='absolute bottom-0 left-1/2 mb-2 transform -translate-x-1/2 text-center text-sm font-poppins whitespace-nowrap'>
                        <span className='font-bold text-lg'>${car.price}</span> for 1 day
                      </div>
                    </div>
                  </div>

                </div>

                {/* Lower box */}
                <div className="lower-box w-full h-1/4 flex flex-row rounded-b-lg">
                  <div className='w-1/4 text-center px-4 py-2'>
                    <img src={car.supplier} alt="logo" className='h-[32px] w-[65px]' />
                  </div>
                  <div className='w-1/2 text-center flex flex-row'>
                    <div className='w-1/2 p-3 flex flex-row justify-center'>
                      <span className='bg-slate-300 p-2 mr-2 text-xs font-poppins font-semibold rounded-lg'>{car.avg_rating}</span>
                      <p className='text-xs font-poppins font-semibold py-2'>Efficiency</p>
                    </div>

                    <div className='w-1/2 p-3 flex flex-row justify-center'>
                      <span className='bg-slate-300 p-2 mr-2 text-xs font-poppins font-semibold rounded-lg'>{car.efficiency_rating}</span>
                      <p className='text-xs font-poppins font-semibold py-2'>Customer Service</p>
                    </div>
                  </div>
                  <div className='w-1/4 text-center'>
                    <form action="POST" onSubmit={(event) => handlePaymentSubmit(event, car)}>
                      <div className='py-2 mx-5 font-semibold font-poppins text-sm text-center shadow-md rounded-3xl bg-yellow-400 relative cursor-pointer hover:z-7 hover:-translate-y-1 transition-transform duration-500'>
                        <button type='submit' className="text-black no-underline hover:underline">
                          Book Now
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )) }
          </div>
        ) : (
          flag && (
            <div className='h-72 mr-8 flex flex-wrap'>
              <div class="flex flex-col items-center max-w-sm mx-auto text-center">
                <p class="p-3 text-sm font-medium text-blue-500 rounded-full bg-blue-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                </p>
                <h1 class="mt-3 text-2xl font-semibold text-gray-800">Car not found</h1>
                <p class="mt-4 text-gray-500">The car you are looking for doesn't exist. Try searching with other locations. </p>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default CarDetail;
