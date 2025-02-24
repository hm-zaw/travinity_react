import React, { useState } from "react";
import Travinity from '/images/travinity_white.png';

function NavForSeperate() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header id="header-section" className="absolute top-0 left-0 w-full text-white z-10">
      <div className="container mx-auto px-4 flex justify-between items-center -mt-3 lg-custom:max-w-[80vw] lg-custom:px-6">
        <div id="left-nav-bar" className="flex items-center space-x-4 lg-custom:-ml-28">
          <img src={Travinity} alt="logo" className="h-24" />
          <nav className="hidden lg-custom:flex space-x-6">
            {["Hotels & Homes", "Flights", "Trains", "Car Services", "Attractions & Tours", "Flight + Hotel"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="whitespace-nowrap hover:text-yellow-400 relative group transition duration-300"
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2.5px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              )
            )}
          </nav>
        </div>
        <div id="right-nav-bar" className="hidden lg-custom:flex space-x-4 -mr-28">
          <a href="#" className="text-white hover:text-blue-600 mt-1">Contact</a>
          <a href="#" className="text-white hover:text-blue-600 mt-1">Help</a>
          <button className="px-3 py-1 bg-white/30 rounded hover:text-blue-700 hover:bg-white whitespace-nowrap">SGD</button>
          <button className="px-3 py-1 bg-white/30 rounded hover:text-blue-700 hover:bg-white whitespace-nowrap">Find Booking</button>
          <button className="px-3 py-1 bg-white text-blue-950 font-bold rounded hover:text-blue-700 whitespace-nowrap">Log In/Register</button>
        </div>

        {/* Mobile Menu Button */}
        <button
          id="menu-toggle"
          className="lg-custom:hidden text-white focus:outline-none relative z-20"
          onClick={toggleMenu}
        >
          <div className={`fixed right-4 top-4 flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all bg-yellow-400 ${isMenuOpen ? "bg-yellow-500" : ""} ring-0 ring-gray-300 hover:ring-8 focus:ring-4 ring-opacity-30 duration-200 shadow-md`}>
            <div className="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden">
              {/* Hamburger Icon Lines */}
              <div
                className={`bg-white h-[2px] w-7 transform transition-all duration-300 origin-left ${
                  isMenuOpen ? "translate-x-10" : ""
                }`}
              ></div>
              <div
                className={`bg-white h-[2px] w-7 rounded transform transition-all duration-300 ${
                  isMenuOpen ? "translate-x-10" : ""
                }`}
              ></div>
              <div
                className={`bg-white h-[2px] w-7 transform transition-all duration-300 origin-left ${
                  isMenuOpen ? "translate-x-10" : ""
                }`}
              ></div>

              {/* X Icon Lines */}
              <div
                className={`absolute items-center justify-between transform transition-all duration-500 top-2.5 ${
                  isMenuOpen ? "translate-x-0" : "-translate-x-10"
                } flex w-0 ${isMenuOpen ? "w-12" : ""}`}
              >
                <div
                  className={`absolute bg-white h-[2px] w-5 transform transition-all duration-500 ${
                    isMenuOpen ? "rotate-45" : "rotate-0"
                  }`}
                ></div>
                <div
                  className={`absolute bg-white h-[2px] w-5 transform transition-all duration-500 ${
                    isMenuOpen ? "-rotate-45" : "rotate-0"
                  }`}
                ></div>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } lg-custom:hidden fixed top-0 right-0 h-full w-72 rounded-l-xl bg-white shadow-lg transform transition-transform duration-300 text-blue-950 z-10`}
      >
        <div className="py-4 px-6 space-y-4 mt-10">
          <a href="#" className="block text-blue-800 hover:text-blue-300">Hotels</a>
          <a href="#" className="block text-blue-800 hover:text-blue-300">Flights</a>
          <a href="#" className="block text-blue-800 hover:text-blue-300">Attractions & Tours</a>
          <a href="#" className="block text-blue-800 hover:text-blue-300">Packages</a>
          <a href="#" className="block text-blue-800 hover:text-blue-300">Contact</a>
          <a href="#" className="block text-blue-800 hover:text-blue-300">Help</a>
          <button className="block w-full px-3 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700">SGD</button>
          <button className="block w-full px-3 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-700">Find Booking</button>
          <button className="block w-full px-3 py-2 mt-2 font-bold text-white bg-blue-700 rounded hover:bg-blue-900">Log In/Register</button>
        </div>
      </div>
    </header>
  );
}

export default NavForSeperate;