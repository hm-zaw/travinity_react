import React from 'react';
import sicon from "/icons/subscribe-icon.png";

const SubscriptionSection = () => {
  return (
    <section className="bg-gradient-to-r from-yellow-300 via-pink-500 to-blue-500 text-white py-10 w-full">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:space-x-6 space-y-6 lg:space-y-0">
          <div className="flex items-center">
            <img src={sicon} alt="subscribe" className="w-30 h-40" />
            <div className="ml-4">
              <h4 className="text-3xl font-semibold">Your Travel Journey Starts Here</h4>
              <p>Sign up and we'll send the best deals to you</p>
            </div>
          </div>
          <div className="w-full lg:max-w-lg">
            <div className="flex">
              <input 
                type="email" 
                className="w-full p-4 rounded-l-lg border-0 outline-none text-gray-800" 
                placeholder="Your Email" 
                aria-label="Your Email" 
                aria-describedby="button-addon2" 
              />
              <button 
                className="bg-blue-700 hover:bg-blue-800 text-white p-4 rounded-r-lg transition-all duration-300" 
                type="button" 
                id="button-addon2"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;