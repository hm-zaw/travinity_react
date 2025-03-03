import { useState, useEffect, useRef } from "react";
import { Filter, Heading, List, ChevronDown, ArrowUpDown } from "lucide-react";
import Header from "../Cruise/CruiseHeader";
import HeaderBg from "../HeaderBg";
import SubscriptionSection from "./SubscriptionSection";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { getMyBookingAll } from "../../api/CarService";

const MyBooking = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(location.state.userData);
  const [myBookingData, setMyBookingData] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: 'date', direction: 'asc' });
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const tabs = ["All", "Car", "Cruise", "Hotel"];

  useEffect(() => {
    getMyAllBooking();
  }, [userData])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    console.log("User data in mb:", userData);
  }, []);

  const getMyAllBooking = async (e) => {
    if(e) { e.preventDefault(); }

    try {
      const allData = await getMyBookingAll(userData.id);
      setMyBookingData(allData.data);
    } catch (error) {
      console.log(error);
    }
  }

  const rowVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (index) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: index * 0.1,  // stagger effect
        duration: 0.3
      }
    })
  };

  // Sort function
  const getSortedData = (data) => {
    if (!sortConfig.field) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];

      // Handle different date fields based on tab
      if (sortConfig.field === 'date') {
        if (activeTab === 'Car Rental') {
          aValue = a.pickUp;
          bValue = b.pickUp;
        } else if (activeTab === 'Cruise') {
          aValue = a.sailing;
          bValue = b.sailing;
        } else if (activeTab === 'Hotel') {
          aValue = a.checkIn;
          bValue = b.checkIn;
        }
      }

      // Handle cost sorting
      if (sortConfig.field === 'cost') {
        aValue = parseFloat(aValue.replace('$', '').replace(',', ''));
        bValue = parseFloat(bValue.replace('$', '').replace(',', ''));
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  return (
    <div className="min-h-screen flex flex-col Dashboard">
      <Header user={userData}/>
      <HeaderBg title={"Booking History"} style="lg:text-[2.5rem] mt-6 font-extrabold md:text-5xl" flag={false} categoryTabs={true} bgColor={'bg-black opacity-30'} images={['/images/booking-bg.jpg']} />
      <main className="flex-1 p-4 px-16 bg-white -mt-[calc(8rem+1.5rem)]">
        
        {/* Combined Desktop Tabs and Mobile Dropdown with Sort */}
        <div className="flex items-center gap-4 mb-5">
          {/* Mobile Dropdown */}
          <div className="md:hidden relative flex-1" ref={dropdownRef}>
            <button 
              className="w-full px-8 py-2 text-[16px] rounded-full border bg-white border-black flex items-center justify-between"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{activeTab}</span>
              <ChevronDown size={20} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-lg shadow-lg z-10">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`w-full px-8 py-2 text-left hover:bg-gray-100 ${
                      activeTab === tab ? "bg-gray-50" : ""
                    }`}
                    onClick={() => {
                      setActiveTab(tab);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Tabs */}
          <div className="hidden relative md:flex items-center gap-4 flex-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-8 py-2 text-[16px] rounded-full border whitespace-nowrap ${
                  activeTab === tab ? "bg-sky-200 border-black" : "bg-sky-100 border-gray-400"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-sky-400 rounded-xl p-8 pb-8 bg-white min-h-[350px] backdrop-blur-sm overflow-x-auto">
          {/* Table structure */}
          <div className="min-w-[1000px]"> {/* Minimum width container */}
            <table className="w-full border-collapse">
              <thead>
              <tr>
                <th className="border-b p-2 text-left text-gray-500">Booking ID</th>
                <th className="border-b p-2 text-left text-gray-500">Category</th>
                <th className="border-b p-2 text-left text-gray-500">Transaction Date</th>
                <th className="border-b p-2 text-left text-gray-500">From - To</th>
                <th className="border-b p-2 text-left text-gray-500">Product ID</th>
                <th className="border-b p-2 text-left text-gray-500">Total Cost</th>
                <th className="border-b p-2 text-left text-gray-500">Status</th>
              </tr>
              </thead>
                <tbody>
                  <AnimatePresence mode="wait">
                    {(() => {
                      const filteredData =
                        activeTab === "All"
                          ? myBookingData
                          : myBookingData.filter((booking) => booking.category.toLowerCase() === activeTab.toLowerCase());

                      if (filteredData.length === 0) {
                        return (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <td colSpan="7" className="border-b p-4 text-center text-gray-500">
                              No bookings found
                            </td>
                          </motion.tr>
                        );
                      }

                      return filteredData.map((booking, index) => (
                        <motion.tr
                          key={booking.id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          custom={index}
                          className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="border-b p-2">{booking.id}</td>
                          <td className="border-b p-2">{booking.category}</td>
                          <td className="border-b p-2">{new Date(booking.transactionDate).toLocaleDateString()}</td>
                          <td className="border-b p-2">
                            {booking.fromDate && booking.toDate ? `${booking.fromDate} - ${booking.toDate}` : "N/A"}
                          </td>
                          <td className="border-b p-2">{booking.product_id}</td>
                          <td className="border-b p-2">
                            ${(booking.pricePerDay * booking.totalDate).toFixed(2)}
                          </td>
                          <td className="border-b p-2">{booking.status}</td>
                        </motion.tr>
                      ));
                    })()}
                  </AnimatePresence>
                </tbody>

            </table>
          </div>
        </div>
      </main>

      <div className='mt-[250px]'>
            <SubscriptionSection />
            <Footer />
        </div>
    </div>

    
  );
};

export default MyBooking;