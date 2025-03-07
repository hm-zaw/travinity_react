import React, { useState, useEffect } from "react";
import logo from "/icons/logo.png";
import { useNavigate } from "react-router-dom";

const NavBar = (user) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isThreeDotsOpen, setIsThreeDotsOpen] = useState(false); // State for three dots dropdown
  const [visibleItems, setVisibleItems] = useState(6); // Number of visible items in the bottom navigation
  const [username, setUsername] = useState("Travinity member");
  
  const menuItems = [
    "My Bookings",
    "Trip Coins: 0",
    "Promo Codes",
    "Manage My Account",
    "Favorites",
    "My Posts",
    "Flight Price Alerts",
    "Member Tiers",
  ];

  // Handle scrolling behavior
  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setIsVisible(false); // Scrolling down, hide navbar
    } else {
      setIsVisible(true); // Scrolling up, show navbar
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  useEffect(() => {
    if(user){
      setUsername(user.user.user.name);
    } else {
      console.log("user not found")
    }
  }, [user])

  // Toggle search visibility and adjust visible items based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 880) {
        setIsSearchVisible(false);
      } else {
        setIsSearchVisible(true);
      }

      // Adjust the number of visible items based on screen width
      if (window.innerWidth < 1024) {
        setIsSmallScreen(true);
        if (window.innerWidth < 768) {
          setVisibleItems(0); // Hide all items on mobile screens
        } else {
          setVisibleItems(4); // Show 4 items on medium-small screens
        }
      } else {
        setIsSmallScreen(false);
        setVisibleItems(6); // Show all 6 items on larger screens
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Bottom navigation items
  const navItems = [
    { name: "Hotels & Homes", path: "/hotel", state: { userData: user.user.user } },
    { name: "Flights", path: "/flight", state: { original: { userData: user.user.user } } },
    { name: "Cruises", path: "/cruises", state: { original: { userData: user.user.user } } },
    { name: "Car Services", path: "/car_rental", state: { original: { userData: user.user.user } } },
    { name: "Attractions & Tours", path: "#attractions" } // Scroll behavior
  ];

  const handleNavigation = (item) => {
    if (item.path.startsWith("/")) {
      navigate(item.path, { state: item.state });
    } else {
      document.getElementById("attractions")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className={`mx-auto text-white fixed z-50 px-8 pt-2.5 pb-5  transition-transform duration-300 bg-gradient-to-b from-black/85 via-black/50 to-transparent backdrop-blur-sm ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="flex justify-between items-center h-[100px] w-screen">
        {/* Logo Column */}
        <div className="flex justify-start flex-[0.20]">
          <a href="/" className="block">
            <img
              src={logo}
              alt="Travinity Logo"
              className="h-auto lg:w-32 sm:w-24"
            />
          </a>
        </div>

        {/* Main Navigation */}
        <div className="flex flex-col w-3/4 flex-[0.80]">
          {/* Top Row (Search Bar and Right-Side Items) */}
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-[400px] mr-4">
              <input
                type="text"
                placeholder="Destination, attraction, hotel, etc."
                className={`px-4 py-2 text-[15px] rounded-full text-black bg-white bg-opacity-90 transition-all duration-300 ${
                  isSearchVisible ? "w-full" : "w-0 opacity-0"
                }`}
              />
              <button
                className={`absolute top-0 right-0 h-full px-4 text-white bg-blue-500 hover:bg-blue-600 rounded-r-full transition-all duration-300 ${
                  isSearchVisible ? "" : "opacity-0"
                }`}
              >
                <i className="fas fa-search"></i>
              </button>
            </div>

            {/* Right-Side Items */}
            <div className="flex justify-end items-center space-x-6 pr-0">
              {/* Customer Support */}
              <a href="#" className="text-[16px] text-white hover:text-yellow-500">
                <i className="fas fa-headset text-xl mr-1"></i>{" "}
                <span className="hidden md:inline">Customer Support</span>
              </a>

              {/* User Dropdown */}
              <button
                className="relative flex items-center text-[16px] hover:text-yellow-500"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <i className="fas fa-user-circle text-xl text-white"></i>
                <span className="ml-2 hidden md:inline">{username}</span>
                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-gradient-to-b from-black via-black/70 to-transparent backdrop-blur-sm text-white rounded-lg shadow-lg"
                    onClick={(e) => e.stopPropagation()} >
                    <ul>
                      {menuItems.map((item, index) => (
                        <li key={index} className="px-4 py-2 hover:text-yellow-500 flex items-center cursor-pointer"
                          onClick={() => {
                            if (item === "My Bookings") {
                              navigate("/myBookings", { state: { userData: user.user.user } }); // Example of passing data
                            }
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </button>

              {/* Coins */}
              <div className="flex items-center space-x-2">
                <i className="fas fa-coins text-xl text-white"></i>
                <span className="transparent w-14"></span>
              </div>
            </div>
          </div>

          {/* Bottom Navigation Links */}
          {/* Hide the entire container on mobile screens */}
          <div className={`mt-4 flex justify-start space-x-9 text-[16px] ${visibleItems === 0 ? "hidden" : ""}`}>
            {/* Visible Items */}
            {navItems
              .slice(0, visibleItems) // Show only the number of visible items
              .map((item, index) => (
                <button
                  key={item}
                  onClick={() => handleNavigation(item)}
                  className="text-white text-[16px] hover:text-yellow-500 relative group transition duration-300 whitespace-nowrap"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2.5px] bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            {/* Three dots for small screens */}
            {isSmallScreen && visibleItems < navItems.length && (
              <div className="relative">
                <button
                  className="text-white text-[18px] hover:text-yellow-500"
                  onClick={() => setIsThreeDotsOpen(!isThreeDotsOpen)}
                >
                  ...
                </button>
                {/* Dropdown for three dots */}
                {isThreeDotsOpen && (
                  <div
                    className="absolute top-full right-0 mt-2 w-48 bg-gradient-to-b from-black via-black/70 to-transparent backdrop-blur-sm text-white rounded-lg shadow-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ul className="py-2">
                      {navItems
                        .slice(visibleItems) // Show the remaining items in the dropdown
                        .map((item, index) => (
                          <li
                            key={index}
                            className="px-4 py-2 hover:text-yellow-500"
                          >
                            <a href="#">{item}</a>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </section>
  );
};

export default NavBar;