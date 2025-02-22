import React, { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header id="header-section" className="absolute top-0 left-0 w-full text-white z-10" >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center -mt-3">
        <div id="left-nav-bar" className="flex items-center space-x-4 lg:-ml-28">
          <img src="/images/travinity_white.png" alt="logo" className="h-20 md:h-24" />
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-blue-300"> Hotels </a>
            <a href="#" className="hover:text-blue-300"> Flights </a>
            <a href="#" className="hover:text-blue-300"> Attractions & Tours </a>
            <a href="#" className="hover:text-blue-300"> Packages </a>
          </nav>
        </div>
        <div id="right-nav-bar" className="hidden md:flex space-x-4 -mr-28">
          <a href="#" className="hover:text-blue-300 mt-1"> Contact </a>
          <a href="#" className="hover:text-blue-300 mt-1"> Help </a>
          <button className="px-3 py-1 bg-white/30 rounded hover:bg-gray-700"> SGD </button>
          <button className="px-3 py-1 bg-white/30 rounded hover:bg-gray-700"> Find Booking </button>
          <button className="px-3 py-1 bg-white/30 rounded hover:bg-gray-700"> Log In/Register </button>
        </div>

        {/* Mobile Menu Button */}
        <button id="menu-toggle" className="md:hidden text-white focus:outline-none" onClick={toggleMenu} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className={`${ isMenuOpen ? "block" : "hidden" } md:hidden bg-black/70 absolute top-full left-0 w-full text-center py-4 space-y-2`}
      >
        <a href="#" className="block text-white hover:text-blue-300"> Hotels </a>
        <a href="#" className="block text-white hover:text-blue-300"> Flights </a>
        <a href="#" className="block text-white hover:text-blue-300"> Attractions & Tours </a>
        <a href="#" className="block text-white hover:text-blue-300"> Packages </a>
        <a href="#" className="block text-white hover:text-blue-300"> Contact </a>
        <a href="#" className="block text-white hover:text-blue-300"> Help </a>
        <button className="block w-11/12 mx-auto px-3 py-1 bg-white/30 rounded hover:bg-gray-700"> SGD </button>
        <button className="block w-11/12 mx-auto px-3 py-1 bg-white/30 rounded hover:bg-gray-700"> Find Booking </button>
        <button className="block w-11/12 mx-auto px-3 py-1 bg-white/30 rounded hover:bg-gray-700"> Log In/Register </button>
      </div>
    </header>
  );
};

export default Header;
