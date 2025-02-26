import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Itinerary from "./Itinerary";
import RequiredDocuments from "./RequiredDocuments";
import RestrictionsPolicies from "./RestrictionsPolicies";
import SelectRoom from "./SelectRoom";

function CruiseBooking() {
  const { CruiseId } = useParams();
  const [ship, setShip] = useState(null);
  const [shipImage, setShipImage] = useState('');
  const [activeProgress, setActiveProgress] = useState("info"); // State to track active tab
  const [activeSection, setActiveSection] = useState("itinerary"); // State to track active section
  const [hasReadRestrictions, setHasReadRestrictions] = useState(false); // State to track if restrictions are read
  const navigate = useNavigate();

  const PIXABAY_API_KEY = '48566746-1f497e57e6596e43958245183';

  const fetchImageFromPixabay = async (query) => {
    const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query + ' cruise ship')}&image_type=photo`;
    try {
      const response = await axios.get(url);
      if (response.data.hits.length > 0) {
        return response.data.hits[0].webformatURL;
      }
    } catch (error) {
      console.error('Error fetching image from Pixabay:', error);
    }
    return 'https://via.placeholder.com/150';
  };

  const getShip = async () => {
    axios.get("../data/cruise.json").then(async (res) => {
      const matchedCruise = res.data.Ships.find((ship) => ship.CruiseId === CruiseId);
      if (matchedCruise) {
        const imageUrl = await fetchImageFromPixabay(matchedCruise.CruiseLine);
        setShipImage(imageUrl);
        setShip(matchedCruise);
      }
    });
  };

  useEffect(() => {
    getShip();
  }, [CruiseId]);

  const TabContent = ({ activeSection, ship }) => {
    switch (activeSection) {
      case "itinerary":
        return <Itinerary ship={ship} />;

      case "requiredDocuments":
        return <RequiredDocuments />;

      case "shipInfo":
        return (
          <div className="text-blue-950">
            <h3 className="text-xl font-bold mb-4">Ship Information</h3>
            <p>Placeholder content for Ship Info tab.</p>
          </div>
        );

      case "feedback":
        return (
          <div className="text-blue-950">
            <h3 className="text-xl font-bold mb-4">Feedback</h3>
            <p>Placeholder content for Feedback tab.</p>
          </div>
        );

      case "restrictionsPolicies":
        return (
          <RestrictionsPolicies/>
        );

      default:
        return null;
    }
  };

  const nights = ship?.Itinerary ? ship.Itinerary.length - 1 : "--";

  return (
    <>
      {ship ? (
        <div className="p-4 bg-transparent min-h-screen flex flex-col items-center relative z-0">

          {/* Breadcrumb */}
          <nav className="text-gray-500 text-sm bg-gray-200 p-1 space-x-3 rounded-xl w-full max-w-6xl mb-4">
            <span onClick={() => navigate("/")} className="text-blue-500 font-medium ml-2 cursor-pointer hover:text-blue-600">Home</span> &gt; 
            <span onClick={() => navigate("/cruises")} className="text-blue-500 font-medium mr-1 cursor-pointer hover:text-blue-600">Cruise Search</span> &gt; 
            <span className="text-blue-950 font-medium">{ship["Ship Name"]}</span>
          </nav>

          {/* Tabs */}
          <div className="w-full max-w-6xl flex rounded-t-3xl overflow-hidden border border-gray-300">
            <div
              className={`flex-1 p-3 text-center cursor-pointer transition-all duration-500 ${
                activeProgress === "info" ? "bg-blue-950 text-white font-semibold" : "bg-gray-200 border-b-[0.5px] border-r-[0.5px] border-blue-950 text-blue-950 font-normal"
              }`}
              onClick={() => setActiveProgress("info")}
            >
              <span className="hidden sm:inline">Cruise Information</span>
              <i className="fa-solid fa-ship sm:hidden"></i>
            </div>
            <div
              className={`flex-1 p-3 text-center transition-all duration-500 ${
                activeProgress === "rooms" ? "bg-blue-950 text-white font-semibold" : "bg-gray-200 border-b-[0.5px] border-r-[0.5px] border-blue-950 text-blue-950 font-normal"
              } ${
                !hasReadRestrictions? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={() => hasReadRestrictions && setActiveProgress("rooms")}
            >
              <span className="hidden sm:inline">Select Room</span>
              <i className="fa-solid fa-bed sm:hidden"></i>
            </div>
            <div className={`flex-1 bg-gray-200 border-b-[0.5px] border-r-[0.5px] border-blue-950 text-blue-950 text-center p-3 cursor-pointer`}>
              <span className="hidden sm:inline">Payment Method</span>
              <i className="fa-solid fa-credit-card sm:hidden"></i>
            </div>
            <div className="flex-1 bg-gray-200 border-b-[0.5px] border-b-blue-950 text-blue-950 text-center p-3 cursor-pointer rounded-tr-lg">
              <span className="hidden sm:inline">Finish</span>
              <i className="fa-solid fa-flag-checkered sm:hidden"></i>
            </div>
          </div>

          {/* Main Content */}
            
          {activeProgress === "info" && (                   
            <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-gray-200 mt-0 p-4 rounded-b-lg shadow-lg">
              
              {/* Sidebar */}
              <div className="w-full lg:w-1/4 bg-white rounded-lg p-5 shadow-md">
                <div className="w-full h-32 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={shipImage} 
                    alt={ship["Ship Name"]} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xl text-blue-950 font-bold">{ship["Ship Name"]}</p>
                <p className="text-blue-950 mt-7"><span className="font-semibold">Cruise ID:</span> {ship.CruiseId}</p>
                <p className="text-blue-950 text-"><span className="font-semibold">License No.</span> {ship.LicenseNo}</p>
                <p className="text-blue-950 mt-7">
                  {ship.DepartCity} → {ship.Destination}
                </p>
                <p className="text-blue-950">
                  {ship.Itinerary[0].Date.substring(3)} → {ship.Itinerary[ship.Itinerary.length - 1].Date.substring(3)}
                </p>
                <p className="text-blue-950">{nights} Nights</p>

                <p className="text-xl text-blue-950 font-bold mt-7">Itinerary</p>

                {/* Itinerary Information */}
                <div className="mt-8">
                  {ship.Itinerary.map((item) => (
                    <div className="mb-5" key={item.Day}>
                      <div className="flex justify-start items-start text-blue-950">
                        <p><i className="fa-solid fa-ship"></i><span className="font-semibold ml-3">Day {item.Day}:</span> {item.PortCity} </p>
                      </div>
                      
                      <div className="flex justify-start items-center text-blue-950 mt-1">
                        <p><i className="fa-regular fa-clock text-lg"></i><span className="ml-3">{item.Date} {item.PortCity === "At Sea" ? "" : (item.Day === 1) ? "| Depart" : "| Arrive"} {item.Departure}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full lg:w-3/4 bg-white rounded-lg p-8 shadow-md ml-0 lg:ml-4">
                <h2 className="text-3xl font-bold text-blue-950">
                  {nights}-Night {ship.Destination} Cruise
                </h2>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3 mt-8">
                  <button 
                    onClick={() => setActiveSection("itinerary")}
                    className={`${
                      activeSection === "itinerary" ? "bg-yellow-400" : "border border-blue-950"
                    } text-blue-950 font-semibold px-4 py-2 rounded-full shadow-md`}
                  >
                    Itinerary
                  </button>
                  <button 
                    onClick={() => setActiveSection("shipInfo")}
                    className={`${
                      activeSection === "shipInfo" ? "bg-yellow-400" : "border border-blue-950"
                    } text-blue-950 font-semibold px-4 py-2 rounded-full shadow-md`}
                  >
                    Ship Info
                  </button>
                  <button 
                    onClick={() => setActiveSection("feedback")}
                    className={`${
                      activeSection === "feedback" ? "bg-yellow-400" : "border border-blue-950"
                    } text-blue-950 font-semibold px-4 py-2 rounded-full shadow-md`}
                  >
                    Feedback
                  </button>
                  <button 
                    onClick={() => setActiveSection("requiredDocuments")}
                    className={`${
                      activeSection === "requiredDocuments" ? "bg-yellow-400" : "border border-blue-950"
                    } text-blue-950 font-semibold px-4 py-2 rounded-full shadow-md`}
                  >
                    Required Documents
                  </button>
                  <button 
                    onClick={() => setActiveSection("restrictionsPolicies")}
                    className={`${
                      activeSection === "restrictionsPolicies" ? "bg-yellow-400" : "border border-blue-950"
                    } text-blue-950 font-semibold px-4 py-2 rounded-full shadow-md`}
                  >
                    Restrictions & Policies
                  </button>
                </div>

                {/* Placeholder for further content */}
                <div className="w-full h-auto bg-gray-200 mt-6 rounded-lg">
                  <div className="overflow-auto h-full p-4">
                    <TabContent activeSection={activeSection} ship={ship} />
                  </div>
                </div>

                <div className="flex justify-between items-center flex-wrap md:flex-1">
                  {/* confirmation checkbox */}
                  <div className="mt-8">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={hasReadRestrictions}
                        onChange={(e) => setHasReadRestrictions(e.target.checked)}
                        className="mr-2"
                      />
                      <span>I have read and agree to the restrictions and policies.</span>
                    </label>
                  </div>
                  {/* Continue Button */}
                  <div className="mt-8">
                    <button onClick={() => setActiveProgress("rooms")}
                      className={`bg-blue-950 text-white font-semibold px-6 py-2 rounded-full shadow-md ${
                        !hasReadRestrictions ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-900"
                      } transition-colors duration-300`}
                      disabled={!hasReadRestrictions}
                    >
                      Continue
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}
              
          {activeProgress === "rooms" && (
              <SelectRoom ship={ship} />
          )}

          </div>
          
      ) : (
        <div className="p-4 text-center text-gray-500">Cruise not found...</div>
      )}
    </>
  );
}

export default CruiseBooking;