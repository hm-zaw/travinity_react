import { useState, useEffect, useRef } from "react";
import { Filter, Heading, List, ChevronDown, ArrowUpDown } from "lucide-react";
import Header from "../Cruise/CruiseHeader";
import HeaderBg from "../HeaderBg";
import SubscriptionSection from "./SubscriptionSection";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";

const MyBooking = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ field: 'date', direction: 'asc' });
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const tabs = ["All", "Car Rental", "Cruise", "Hotel"];

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

  const getAllBooking = async (e) => {
    e.preventDefaul();

    try {
      const allData = await getBookingAll();
    } catch (error) {
      console.log(error);
    }
  }

  // Hardcoded data for each tab
  const bookingData = {
    All: [
      { id: "B001", type: "Car Rental", date: "2025-02-10", dates: "2025-02-15 to 2025-02-20", location: "New York", cost: "$150", status: "Completed" },
      { id: "B002", type: "Cruise", date: "2025-02-12", dates: "2025-02-20 to 2025-02-25", location: "Miami", cost: "$1,200", status: "Completed" },
      { id: "B003", type: "Hotel", date: "2025-02-15", dates: "2025-02-18 to 2025-02-22", location: "Los Angeles", cost: "$500", status: "Completed" },
      { id: "B004", type: "Car Rental", date: "2025-03-01", dates: "2025-03-05 to 2025-03-10", location: "Chicago", cost: "$180", status: "Upcoming" },
      { id: "B005", type: "Hotel", date: "2025-03-10", dates: "2025-03-15 to 2025-03-20", location: "Las Vegas", cost: "$750", status: "Upcoming" },
      { id: "B006", type: "Cruise", date: "2025-04-01", dates: "2025-04-05 to 2025-04-12", location: "Caribbean", cost: "$2,200", status: "Upcoming" },
      { id: "B007", type: "Hotel", date: "2025-04-15", dates: "2025-04-20 to 2025-04-25", location: "Paris", cost: "$1,800", status: "Upcoming" },
      { id: "B008", type: "Car Rental", date: "2025-05-01", dates: "2025-05-05 to 2025-05-10", location: "London", cost: "$220", status: "Upcoming" }
    ],
    "Car Rental": [
      { id: "CR001", company: "Hertz", pickUp: "2025-02-15 10:00", return: "2025-02-20 12:00", pickUpLocation: "New York", vehicle: "Sedan", cost: "$150", status: "Returned" },
      { id: "CR002", company: "Enterprise", pickUp: "2025-01-20 09:00", return: "2025-01-25 11:00", pickUpLocation: "Chicago", vehicle: "SUV", cost: "$200", status: "Returned" },
      { id: "CR003", company: "Avis", pickUp: "2025-03-05 14:00", return: "2025-03-10 16:00", pickUpLocation: "Los Angeles", vehicle: "Luxury", cost: "$300", status: "Upcoming" },
      { id: "CR004", company: "Budget", pickUp: "2025-03-15 08:00", return: "2025-03-18 10:00", pickUpLocation: "Miami", vehicle: "Economy", cost: "$120", status: "Upcoming" },
      { id: "CR005", company: "National", pickUp: "2025-04-01 11:00", return: "2025-04-05 13:00", pickUpLocation: "Las Vegas", vehicle: "Premium", cost: "$250", status: "Upcoming" },
      { id: "CR006", company: "Sixt", pickUp: "2025-04-15 09:00", return: "2025-04-20 11:00", pickUpLocation: "San Francisco", vehicle: "Electric", cost: "$280", status: "Upcoming" },
      { id: "CR007", company: "Alamo", pickUp: "2025-05-01 10:00", return: "2025-05-06 12:00", pickUpLocation: "Seattle", vehicle: "Hybrid", cost: "$220", status: "Upcoming" }
    ],
    Cruise: [
      { id: "C001", line: "Royal Caribbean", sailing: "2025-02-20", duration: "5 days", port: "Miami", ship: "Harmony of the Seas", cost: "$1,200", status: "Completed" },
      { id: "C002", line: "Norwegian", sailing: "2025-03-01", duration: "7 days", port: "Seattle", ship: "Bliss", cost: "$1,500", status: "Upcoming" },
      { id: "C003", line: "Carnival", sailing: "2025-04-05", duration: "4 days", port: "New Orleans", ship: "Breeze", cost: "$800", status: "Upcoming" },
      { id: "C004", line: "Princess", sailing: "2025-05-10", duration: "10 days", port: "Vancouver", ship: "Royal Princess", cost: "$2,500", status: "Upcoming" },
      { id: "C005", line: "Celebrity", sailing: "2025-06-15", duration: "14 days", port: "Barcelona", ship: "Edge", cost: "$3,200", status: "Upcoming" },
      { id: "C006", line: "MSC", sailing: "2025-07-01", duration: "8 days", port: "Venice", ship: "Seashore", cost: "$1,800", status: "Upcoming" },
      { id: "C007", line: "Holland America", sailing: "2025-07-15", duration: "12 days", port: "Sydney", ship: "Koningsdam", cost: "$2,800", status: "Upcoming" }
    ],
    Hotel: [
      { id: "H001", name: "Marriott", checkIn: "2025-02-18", checkOut: "2025-02-22", location: "Los Angeles", room: "Standard", cost: "$500", status: "Checked Out" },
      { id: "H002", name: "Hilton", checkIn: "2025-01-10", checkOut: "2025-01-15", location: "San Francisco", room: "Suite", cost: "$800", status: "Checked Out" },
      { id: "H003", name: "Hyatt", checkIn: "2025-03-15", checkOut: "2025-03-20", location: "Las Vegas", room: "Deluxe", cost: "$750", status: "Upcoming" },
      { id: "H004", name: "Four Seasons", checkIn: "2025-04-01", checkOut: "2025-04-05", location: "New York", room: "Executive", cost: "$1,200", status: "Upcoming" },
      { id: "H005", name: "Ritz-Carlton", checkIn: "2025-05-10", checkOut: "2025-05-15", location: "Miami", room: "Ocean View", cost: "$1,500", status: "Upcoming" },
      { id: "H006", name: "W Hotels", checkIn: "2025-06-20", checkOut: "2025-06-25", location: "Chicago", room: "Studio", cost: "$900", status: "Upcoming" },
      { id: "H007", name: "InterContinental", checkIn: "2025-07-01", checkOut: "2025-07-07", location: "Tokyo", room: "City View", cost: "$1,100", status: "Upcoming" },
      { id: "H008", name: "Mandarin Oriental", checkIn: "2025-07-15", checkOut: "2025-07-20", location: "Singapore", room: "Harbor View", cost: "$1,800", status: "Upcoming" }
    ]
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

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

  // Sort handler
  const handleSort = (field) => {
    setSortConfig(current => {
      if (current.field === field) {
        if (current.direction === 'asc') {
          return { field, direction: 'desc' };
        }
        // If already desc, clear sorting
        return { field: 'date', direction: 'asc' };
      }
      return { field, direction: 'asc' };
    });
  };

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortConfig.field !== field) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="min-h-screen flex flex-col Dashboard">
      <Header />
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

          {/* Sort Button (visible on all screen sizes) */}
          <div className="relative" ref={sortDropdownRef}>
            <button 
              className="py-2 px-7 bg-sky-100 rounded-lg hover:bg-sky-200 flex items-center gap-2"
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            >
              <ArrowUpDown size={20} />
              <span>Sort</span>
            </button>
            
            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-1 bg-white rounded-lg shadow-lg z-10 min-w-[150px]">
                <button
                  className={`w-full px-4 py-2 text-left hover:bg-sky-100 active:bg-sky-200 flex justify-between items-center`}
                  onClick={() => handleSort('id')}
                >
                  <span>By ID</span>
                  <span>{getSortIndicator('id')}</span>
                </button>
                <button
                  className={`w-full px-4 py-2 text-left hover:bg-sky-100 active:bg-sky-200 flex justify-between items-center`}
                  onClick={() => handleSort('date')}
                >
                  <span>By Date</span>
                  <span>{getSortIndicator('date')}</span>
                </button>
                <button
                  className={`w-full px-4 py-2 text-left hover:bg-sky-100 active:bg-sky-200 flex justify-between items-center`}
                  onClick={() => handleSort('cost')}
                >
                  <span>By Price</span>
                  <span>{getSortIndicator('cost')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="border border-sky-400 rounded-xl p-8 pb-8 bg-white min-h-[350px] backdrop-blur-sm overflow-x-auto">
          {/* Table structure */}
          <div className="min-w-[1000px]"> {/* Minimum width container */}
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {activeTab === "All" && (
                    <>
                      <th className="border-b p-2 text-left text-gray-500">Booking ID</th>
                      <th className="border-b p-2 text-left text-gray-500">Type</th>
                      <th className="border-b p-2 text-left text-gray-500">Date of Booking</th>
                      <th className="border-b p-2 text-left text-gray-500">Check-in/Check-out or Rental Dates</th>
                      <th className="border-b p-2 text-left text-gray-500">Location/Vendor</th>
                      <th className="border-b p-2 text-left text-gray-500">Total Cost</th>
                      <th className="border-b p-2 text-left text-gray-500">Status</th>
                    </>
                  )}
                  {activeTab === "Car Rental" && (
                    <>
                      <th className="border-b p-2 text-left text-gray-500">Booking ID</th>
                      <th className="border-b p-2 text-left text-gray-500">Rental Company</th>
                      <th className="border-b p-2 text-left text-gray-500">Pick-up Date & Time</th>
                      <th className="border-b p-2 text-left text-gray-500">Return Date & Time</th>
                      <th className="border-b p-2 text-left text-gray-500">Pick-up Location</th>
                      <th className="border-b p-2 text-left text-gray-500">Vehicle Type</th>
                      <th className="border-b p-2 text-left text-gray-500">Total Cost</th>
                      <th className="border-b p-2 text-left text-gray-500">Status</th>
                    </>
                  )}
                  {activeTab === "Cruise" && (
                    <>
                      <th className="border-b p-2 text-left text-gray-500">Booking ID</th>
                      <th className="border-b p-2 text-left text-gray-500">Cruise Line</th>
                      <th className="border-b p-2 text-left text-gray-500">Sailing Date</th>
                      <th className="border-b p-2 text-left text-gray-500">Duration</th>
                      <th className="border-b p-2 text-left text-gray-500">Departure Port</th>
                      <th className="border-b p-2 text-left text-gray-500">Ship Name</th>
                      <th className="border-b p-2 text-left text-gray-500">Total Cost</th>
                      <th className="border-b p-2 text-left text-gray-500">Status</th>
                    </>
                  )}
                  {activeTab === "Hotel" && (
                    <>
                      <th className="border-b p-2 text-left text-gray-500">Booking ID</th>
                      <th className="border-b p-2 text-left text-gray-500">Hotel Name</th>
                      <th className="border-b p-2 text-left text-gray-500">Check-in Date</th>
                      <th className="border-b p-2 text-left text-gray-500">Check-out Date</th>
                      <th className="border-b p-2 text-left text-gray-500">Location</th>
                      <th className="border-b p-2 text-left text-gray-500">Room Type</th>
                      <th className="border-b p-2 text-left text-gray-500">Total Cost</th>
                      <th className="border-b p-2 text-left text-gray-500">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="wait">
                  {getSortedData(bookingData[activeTab]).map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      {activeTab === "All" && (
                        <>
                          <td className="border-b p-2">{booking.id}</td>
                          <td className="border-b p-2">{booking.type}</td>
                          <td className="border-b p-2">{booking.date}</td>
                          <td className="border-b p-2">{booking.dates}</td>
                          <td className="border-b p-2">{booking.location}</td>
                          <td className="border-b p-2">{booking.cost}</td>
                          <td className="border-b p-2">{booking.status}</td>
                        </>
                      )}
                      {activeTab === "Car Rental" && (
                        <>
                          <td className="border-b p-2">{booking.id}</td>
                          <td className="border-b p-2">{booking.company}</td>
                          <td className="border-b p-2">{booking.pickUp}</td>
                          <td className="border-b p-2">{booking.return}</td>
                          <td className="border-b p-2">{booking.pickUpLocation}</td>
                          <td className="border-b p-2">{booking.vehicle}</td>
                          <td className="border-b p-2">{booking.cost}</td>
                          <td className="border-b p-2">{booking.status}</td>
                        </>
                      )}
                      {activeTab === "Cruise" && (
                        <>
                          <td className="border-b p-2">{booking.id}</td>
                          <td className="border-b p-2">{booking.line}</td>
                          <td className="border-b p-2">{booking.sailing}</td>
                          <td className="border-b p-2">{booking.duration}</td>
                          <td className="border-b p-2">{booking.port}</td>
                          <td className="border-b p-2">{booking.ship}</td>
                          <td className="border-b p-2">{booking.cost}</td>
                          <td className="border-b p-2">{booking.status}</td>
                        </>
                      )}
                      {activeTab === "Hotel" && (
                        <>
                          <td className="border-b p-2">{booking.id}</td>
                          <td className="border-b p-2">{booking.name}</td>
                          <td className="border-b p-2">{booking.checkIn}</td>
                          <td className="border-b p-2">{booking.checkOut}</td>
                          <td className="border-b p-2">{booking.location}</td>
                          <td className="border-b p-2">{booking.room}</td>
                          <td className="border-b p-2">{booking.cost}</td>
                          <td className="border-b p-2">{booking.status}</td>
                        </>
                      )}
                    </motion.tr>
                  ))}
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