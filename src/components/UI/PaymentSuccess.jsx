import React from 'react'
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchUser } from '../../api/CarService';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const carName = queryParams.get('car_name');
    const hotelName = queryParams.get('hotel_name');
    const cruiseName = queryParams.get('cruise_name');
    const user_id = queryParams.get('user_id');

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (user_id) {
            fetchUser(user_id).then((data) => {
                if (data) {
                    setUserData(data);
                }
            }).catch(error => {
                console.error("Error fetching user data:", error);
            });
        }
    }, [user_id]);

    const searchData1 = {
        original: {
          userData,
        },
      };

      const searchData2 = {
        userData: {
            userData
        }
      }

    useEffect(() => {
        console.log("userData for hotel: ", searchData2);
    }, [searchData2]);

    const handleGoBackHotel = () => {
        navigate("/hotel", { state: searchData2 });
    }

    const handleGoBackCruise = () => {
        navigate("/cruises", {state: searchData1});
    }

    const handleGoBackCar = () => {
        navigate("/car_rental", {state: searchData1})
    }

  return (
        <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            <div class="w-full max-w-2xl p-4 bg-white shadow-2xl dark:bg-gray-900 sm:p-10 sm:rounded-3xl">
                <div class="text-center">
                    <div class="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full dark:bg-green-700">
                        <svg class="h-12 w-12 text-green-600 dark:text-green-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                        </svg>
                    </div>
                    <h1 class="text-4xl font-extrabold text-green-700 dark:text-green-400">Payment Successful!</h1>
                    <p class="mt-4 text-lg text-gray-800 dark:text-gray-300">
                        Thank you for your purchase.
                    </p>
                
                    <p class="mt-12 text-xs text-gray-700 dark:text-gray-400">
                        If you have any questions or need further assistance, feel free to contact us at:
                        <a href="mailto:admin@eliteai.tools" class="font-medium text-indigo-600 dark:text-indigo-400 underline ml-2">
                            travinity666@gmail.com
                        </a>
                    </p>
                </div>
                {carName ? (
                    <div className="mt-8 text-center" onClick={handleGoBackCar}>
                        <p className="inline-block px-6 py-2 text-lg font-medium text-white transition-transform rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-105 hover:from-indigo-700 hover:to-blue-700 dark:from-indigo-500 dark:to-blue-500 dark:hover:from-indigo-600 dark:hover:to-blue-600" >
                        Back to Home
                        </p>
                    </div>
                ) : hotelName ? (
                    <div className="mt-8 text-center" onClick={handleGoBackHotel}>
                        <p className="inline-block px-6 py-2 text-lg font-medium text-white transition-transform rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-105 hover:from-indigo-700 hover:to-blue-700 dark:from-indigo-500 dark:to-blue-500 dark:hover:from-indigo-600 dark:hover:to-blue-600" >
                        Back to Home
                        </p>
                    </div>
                ) : cruiseName ? (
                    <div className="mt-8 text-center" onClick={handleGoBackCruise}>
                        <p className="inline-block px-6 py-2 text-lg font-medium text-white transition-transform rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-105 hover:from-indigo-700 hover:to-blue-700 dark:from-indigo-500 dark:to-blue-500 dark:hover:from-indigo-600 dark:hover:to-blue-600" >
                        Back to Home
                        </p>
                    </div>
                ) : null}
                
            </div>
        </div>
    );
}

export default PaymentSuccess