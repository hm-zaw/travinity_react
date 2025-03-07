import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { checkPaymentCruise } from '../../api/CarService';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        {children}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const RoomDetailOverlay = ({ room, onClose, getRoomImage, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 bg-black bg-opacity-95 flex justify-center items-center z-50 p-6 w-screen h-screen ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="text-white w-full h-full flex flex-col p-8 rounded-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-3xl font-semibold text-gray-300">{room.Name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
        </div>

        {/* Content */}
        <div className="flex w-full h-full mt-4">
          {/* Left - Image */}
          <div className="w-1/2 flex items-center">
            <img
              src={getRoomImage(room.Category)}
              alt={room.Name}
              className="w-full rounded-lg"
            />
          </div>

          {/* Right - Room Details */}
          <div className="w-1/2 pl-8 flex flex-col justify-start">
            <h3 className="text-xl font-semibold text-gray-300 mb-4">Basic Information</h3>
            <div className="border-t border-gray-700 pt-4 space-y-4 text-lg">
              <p className="flex justify-between"><span className="text-gray-400">Room size</span> <span>{room["Room Size"]}</span></p>
              <p className="flex justify-between"><span className="text-gray-400">Number of Guests</span> <span>{room["Number of Guests"]}</span></p>
              <p className="flex justify-between"><span className="text-gray-400">Decks</span> <span>{room.Decks}</span></p>
              <p className="flex flex-col justify-between"><span className="text-gray-400 mr-12">Description</span> <span className="mt-3">{room.Description}</span></p>
              <p className="flex justify-between">
                <span className="text-gray-400">Price</span> 
                <div className="flex flex-col items-end">
                <span className="text-xl font-bold">${room.Price}</span>
                <p className="text-sm text-gray-400">per room per night incl. port fees</p>
                </div>
              </p>
              
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function SelectRoom({ ship, userData }) {
  const [selectedCategory, setSelectedCategory] = useState("Interior");
  const [isFixed, setIsFixed] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [roomQuantities, setRoomQuantities] = useState({});
  const [passengerDetails, setPassengerDetails] = useState({});
  const [totalRooms, setTotalRooms] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ title: '', message: '' });
  const totalRef = useRef(null);
  const [grandTotalPrice, setGrandTotalPrice] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isPricePanelVisible, setIsPricePanelVisible] = useState(false);

  // Calculate number of nights from ship itinerary
  const numberOfNights = useMemo(() => {
    if (!ship.Itinerary || ship.Itinerary.length < 2) return 1;
    return ship.Itinerary.length - 1; // Subtract 1 from total days to get nights
  }, [ship.Itinerary]);

  useEffect(() => {
    console.log("userData at selectroom: ", userData);
  }, [userData])

  // Calculate price for a passenger type
  const calculatePassengerPrice = (baseAdultPrice, passengerType) => {
    switch (passengerType) {
      case 'adults':
        return baseAdultPrice;
      case 'teens':
        return baseAdultPrice * 0.75;
      case 'children':
        return baseAdultPrice * 0.5;
      case 'infants':
        return 0;
      default:
        return 0;
    }
  };

  // Calculate total price for a room
  const calculateRoomPrice = (room, quantity, passengers) => {
    const maxOccupancy = parseInt(room["Number of Guests"].split("-")[1]);
    const baseAdultPrice = room.Price / maxOccupancy; // Price per adult per night
    
    if (room.Name.toLowerCase().includes('studio')) {
      return room.Price * numberOfNights; // Studio rooms have fixed price
    }

    // For regular rooms, if only adults are present and less than max occupancy,
    // charge for full occupancy
    if (passengers && 
        passengers.teens === 0 && 
        passengers.children === 0 && 
        passengers.infants === 0 && 
        passengers.adults < maxOccupancy) {
      // Charge for full occupancy (maxOccupancy * baseAdultPrice)
      return (maxOccupancy * baseAdultPrice) * numberOfNights;
    }

    // For mixed passenger types, calculate as before
    let pricePerNight = 0;
    if (passengers) {
      Object.entries(passengers).forEach(([type, count]) => {
        const passengerPrice = calculatePassengerPrice(baseAdultPrice, type);
        pricePerNight += passengerPrice * count;
      });
    }

    return pricePerNight * numberOfNights;
  };

  // Update price calculation useEffect
  useEffect(() => {
    const newTotalPrice = Object.keys(roomQuantities).reduce((total, roomName) => {
      const room = ship.Staterooms.find(room => room.Name === roomName);
      const roomPassengers = passengerDetails[roomName];
      const roomQuantity = roomQuantities[roomName];
      
      const roomPrice = calculateRoomPrice(room, roomQuantity, roomPassengers);
      return total + roomPrice;
    }, 0);
  
    setGrandTotalPrice(newTotalPrice);

    console.log("one night: ", newTotalPrice);
  }, [roomQuantities, passengerDetails, ship.Staterooms]);
  

  const filteredRooms = ship.Staterooms.filter(room => room.Category === selectedCategory);

  useEffect(() => {
    const handleScroll = () => {
      if (totalRef.current) {
        const rect = totalRef.current.getBoundingClientRect();
        setIsFixed(rect.bottom <= window.innerHeight);
      }
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleRoomChange = (roomName, delta) => {
    setRoomQuantities(prev => {
      const newQuantities = { ...prev };
      const currentRoomQuantity = newQuantities[roomName] || 0;
      const newRoomQuantity = currentRoomQuantity + delta;
  
      const newTotalRooms = Object.values(newQuantities).reduce(
        (sum, qty) => sum + qty, 
        0
      ) + delta;
  
      const room = ship.Staterooms.find(room => room.Name === roomName);
  
      if (newTotalRooms > 5) {
        setAlertMessage({
          title: 'Maximum Rooms Reached',
          message: 'You can only book a maximum of 5 rooms at a time.'
        });
        setShowAlert(true);
        return prev;
      }
  
      if (newRoomQuantity > room["Available Rooms"] || newRoomQuantity < 0) {
        return prev;
      }
  
      if (delta > 0) {
        const maxOccupancy = parseInt(room["Number of Guests"].split("-")[1]);
        if (room.Name.toLowerCase().includes('studio')) {
          setPassengerDetails(prev => ({
            ...prev,
            [roomName]: {
              adults: 1,
              teens: 0,
              children: 0,
              infants: 0
            }
          }));
        } else {
          // Ensure at least newRoomQuantity adults
          setPassengerDetails(prev => ({
            ...prev,
            [roomName]: {
              adults: Math.max(newRoomQuantity, maxOccupancy * newRoomQuantity),
              teens: 0,
              children: 0,
              infants: 0
            }
          }));
        }
      }
      
      if (delta < 0) {
        if (newRoomQuantity === 0) {
          // Remove all passenger details when room quantity becomes 0
          setPassengerDetails(prev => {
            const newDetails = { ...prev };
            delete newDetails[roomName];
            return newDetails;
          });
          delete newQuantities[roomName];
        } else {
          // When reducing rooms, adjust passenger counts proportionally
          setPassengerDetails(prev => {
            const currentDetails = prev[roomName];
            if (currentDetails) {
              const room = ship.Staterooms.find(room => room.Name === roomName);
              const maxOccupancy = parseInt(room["Number of Guests"].split("-")[1]);
              
              return {
                ...prev,
                [roomName]: {
                  // Ensure minimum adults equals number of rooms
                  adults: Math.max(newRoomQuantity, Math.min(currentDetails.adults, maxOccupancy * newRoomQuantity)),
                  // Reduce other passenger types proportionally
                  teens: Math.min(currentDetails.teens, maxOccupancy * newRoomQuantity - newRoomQuantity),
                  children: Math.min(currentDetails.children, maxOccupancy * newRoomQuantity - newRoomQuantity),
                  infants: Math.min(currentDetails.infants, maxOccupancy * newRoomQuantity - newRoomQuantity)
                }
              };
            }
            return prev;
          });
        }
      }
  
      if (newRoomQuantity > 0) {
        newQuantities[roomName] = newRoomQuantity;
      }
      return newQuantities;
    });
  };

  
  const handlePassengerChange = (roomName, passengerType, delta) => {
    const room = ship.Staterooms.find(room => room.Name === roomName);
    const maxOccupancy = parseInt(room["Number of Guests"].split("-")[1]);
    const roomQuantity = roomQuantities[roomName];
    const totalMaxPassengers = maxOccupancy * roomQuantity;

    setPassengerDetails(prev => {
      const currentDetails = prev[roomName] || {
        adults: maxOccupancy,
        teens: 0,
        children: 0,
        infants: 0
      };

      const newDetails = { ...currentDetails };
      
      // If trying to reduce adults
      if (passengerType === 'adults' && delta < 0) {
        const newAdultCount = Math.max(0, currentDetails.adults + delta);
        
        // Check if this would result in fewer adults than rooms
        const totalRooms = roomQuantities[roomName];
        if (newAdultCount < totalRooms) {
          setAlertMessage({
            title: 'Minimum Adults Required',
            message: `You must have at least ${totalRooms} adult${totalRooms > 1 ? 's' : ''} for ${totalRooms} room${totalRooms > 1 ? 's' : ''}.`
          });
          setShowAlert(true);
          return prev;
        }
      }

      // Calculate new value for the passenger type
      const newValue = Math.max(0, (currentDetails[passengerType] || 0) + delta);
      
      // Calculate total passengers after change
      const newTotal = Object.entries(newDetails).reduce((sum, [type, count]) => {
        return sum + (type === passengerType ? newValue : count);
      }, 0);

      // Check if the change would exceed total maximum passengers
      if (newTotal > totalMaxPassengers) {
        setAlertMessage({
          title: 'Maximum Occupancy Reached',
          message: `The maximum number of passengers for ${roomQuantity} ${room.Name} room(s) is ${totalMaxPassengers}.`
        });
        setShowAlert(true);
        return prev;
      }

      newDetails[passengerType] = newValue;
      
      return {
        ...prev,
        [roomName]: newDetails
      };
    });
  };

  const getRoomImage = (roomCategory) => {
    switch (roomCategory) {
      case "Ocean View":
        return "https://i.pinimg.com/736x/7b/96/97/7b9697d0880672312220d6f1f062a937.jpg";
      case "Interior":
        return "https://storage.googleapis.com/wth_media_library_staging/media_library/38957/conversions/Royal-Caribbean-International-Harmony-of-the-Seas-Promenade-View-Interior-modal_landscape.jpg"; // Replace with actual interior room image
      case "Balcony":
        return "https://i0.wp.com/thepointsguy.com/wp-content/uploads/2020/01/1452893905_AN-StudioOceanViewCatSB-scaled.jpg?fit=2048%2C2048px&quality=1"; // Replace with actual balcony room image
      case "Suite":
        return "https://itravelcdn.com/enhance/images/ee9bf5db-d8d9-40a1-a378-5480ec183c7b_1_1_800_800.jpg"; // Replace with actual suite image
      default:
        return "/room-placeholder.jpg";
    }
  };

  const handleCruiseRoomPurchase = async (e, ship) => {
    e.preventDefault();

    const validAmount = Math.round(grandTotalPrice * 100);

    const formatDate = (date) => {
      const d = new Date(date);
      return d.toISOString().split("T")[0]; // Converts to "yyyy-MM-dd"
    };

    const info = { 
      amount: validAmount/3,
      name: `${ship.Itinerary.length - 1}-Night ${ship.Destination} Cruise`,
      product_id: ship.CruiseId,
      fromDate: formatDate(ship.Itinerary[0].Date),
      toDate: formatDate(ship.Itinerary[ship.Itinerary.length - 1].Date),
      quantity: ship.Itinerary.length - 1,
      multiplier: 100,
      currency: 'USD',
      email: userData.email, // to replace with user's email
      user_id: userData.id, // to replace with user's id
      status: "PAID",
      category: "cruise",
      transaction_date: new Date().toISOString()
    }

    console.log("Payload being sent is: ", info);
    try {
      const response = await checkPaymentCruise({
        paymentInfo: info
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
  }

  const AnimatedRoomCards = motion.div;
  const AnimatedCard = motion.div;

  return (
    <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-gray-200 mt-0 p-4 rounded-b-lg shadow-lg">
      {/* Updated Modal Alert */}
      <Modal isOpen={showAlert} onClose={() => setShowAlert(false)}>
        <p className="text-red-600 font-bold text-xl">{alertMessage.title}</p>
        <p className="text-gray-700">{alertMessage.message}</p>
      </Modal>

      {/* Room Detail Overlay - Highest z-index */}
      {selectedRoom && (
        <RoomDetailOverlay
          room={selectedRoom}
          onClose={() => setSelectedRoom(null)}
          getRoomImage={getRoomImage}
          className="z-[100]"  // Highest z-index
        />
      )}

      {/* Ship Details Section */}
      <div className="w-full lg:w-3/4 pr-0 lg:pr-4 space-y-4">
        <div className="p-7 bg-gray-50 rounded-lg shadow-lg">
          <h2 className="text-3xl text-blue-950 font-bold">
            {ship.Itinerary.length - 1}-Night {ship.Destination} Cruise
          </h2>
          <p className="text-blue-950 font-bold mt-1">{ship["Ship Name"]} | <span className="font-normal">{ship.CruiseLine}</span></p>

          <div className="mt-4 text-gray-700 pt-4 border-t-[0.8px]">
            <p><strong>Depart: </strong> {ship.Itinerary[0].Date} - {ship.Itinerary[0].PortCity}, {ship.Itinerary[0].PortCountry}</p>
            <p><strong>Arrive: </strong> {ship.Itinerary[ship.Itinerary.length - 1].Date} - {ship.Itinerary[ship.Itinerary.length - 1].PortCity}, {ship.Itinerary[ship.Itinerary.length - 1].PortCountry}</p>
          </div>
        </div>

        {/* Category Selection Section */}
        <div className="p-7 bg-gray-50 rounded-lg shadow-lg">
          <div className="border-b w-full pb-2 flex space-x-4 font-medium text-blue-950">
            {["Interior", "Ocean View", "Balcony", "Suite"].map((item) => (
              <div
                key={item}
                className={`flex-1 h-8 cursor-pointer text-center whitespace-nowrap ${selectedCategory === item && "text-blue-800 font-bold"} relative group transition duration-300`}
                onClick={() => setSelectedCategory(item)}
              >
                {item}
                <span className={`absolute left-0 -bottom-2 w-0 h-[2.5px] bg-blue-800 transition-all duration-300 ${selectedCategory === item && "w-full"}`}></span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            <AnimatedRoomCards
              key={selectedCategory}
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  opacity: 1,
                  transition: {
                    when: "beforeChildren",
                    staggerChildren: 0.3,
                  },
                },
                hidden: {
                  opacity: 0,
                },
              }}
            >
              {filteredRooms.map((room, index) => (
                <AnimatedCard
                  key={index}
                  variants={{
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: {
                        duration: 0.5
                      }
                    },
                    hidden: { 
                      opacity: 0, 
                      x: -20 
                    }
                  }}
                  className="flex flex-col shadow-lg bg-gray-50"
                >
                  <div className="flex flex-col sm:flex-row items-center border p-6 pb-8 sm:p-4 rounded-lg">
                    <img
                      src={getRoomImage(room.Category)}
                      alt={room.Name}
                      className="w-full h-48 sm:w-32 sm:h-32 rounded-lg object-cover cursor-pointer mb-4 sm:mb-0"
                      onClick={() => setSelectedRoom(room)}
                    />
                    <div className="w-full sm:ml-4 pl-2  flex-1">
                      <div className="flex items-center">
                        <h3 className="font-semibold text-xl mr-2">{room.Name}</h3>
                        <p className="bg-yellow-400 font-semibold rounded-[4px] px-1 py-[0.5px] text-yellow-900 text-sm">{room["Category Code"]}</p>
                      </div>
                      <p className="text-gray-500 text-sm">Room size: {room["Room Size"]}</p>
                      <p className="text-gray-500 text-sm">Decks: {room.Decks}</p>
                      <p className="text-gray-500 text-sm">Number of guests: {room["Number of Guests"]}</p>
                    </div>
                    <div className="text-center sm:text-right pr-2 mt-12 sm:mt-0">
                      <p className="font-semibold text-base">From <span className="text-2xl">${room.Price}</span></p>
                      <p className="text-sm text-gray-500">per room per night incl. port fees</p>
                      <div className="flex justify-center sm:justify-end items-center mt-2">

                      <p className="text-red-500 font-medium text-sm mr-2"> 
                        {room["Available Rooms"] > 0 ? `Only ${room["Available Rooms"]} rooms left` : "Sold Out"}</p>

                        <button className="text-blue-800" onClick={() => handleRoomChange(room.Name, -1)}>
                          <i className="fa-solid fa-circle-minus text-xl"></i>
                        </button>
                        <span className="px-4">{roomQuantities[room.Name] || 0}</span>
                        <button
                          className="text-blue-800"
                          onClick={() => handleRoomChange(room.Name, 1)}
                        >
                          <i className="fa-solid fa-circle-plus text-xl"></i>
                        </button>
                      </div>
                    </div>
                    
                  </div>
                  {/* Passenger Selection */}
                  {roomQuantities[room.Name] > 0 && !room.Name.toLowerCase().includes('studio') && (
                    <div className="mt-4 p-6 sm:p-4 bg-gradient-to-b from-blue-100 to-gray-100 rounded-lg">
                      <p className="font-medium mb-2">Passengers</p>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'Adults', key: 'adults' },
                          { label: 'Teens (12-17)', key: 'teens' },
                          { label: 'Children (2-11)', key: 'children' },
                          { label: 'Infants (0-2)', key: 'infants' },
                        ].map(({ label, key }) => (
                          <div key={key} className="flex flex-col items-center">
                            <span className="text-sm text-gray-700 mb-1">{label}</span>
                            <div className="flex items-center rounded-full overflow-hidden">
                              <button
                                className="bg-blue-800 text-white flex justify-center items-center px-3 py-1"
                                onClick={() => handlePassengerChange(room.Name, key, -1)}
                              >
                                -
                              </button>
                              <span className="bg-gray-300 text-blue-950 flex justify-center items-center font-semibold w-8 h-8">
                                {passengerDetails[room.Name]?.[key] || 0}
                              </span>
                              <button
                                className="bg-blue-800 text-white flex justify-center items-center px-3 py-1"
                                onClick={() => handlePassengerChange(room.Name, key, 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </AnimatedCard>
              ))}
            </AnimatedRoomCards>
          </div>
        </div>

        {/* Static Total Price Section */}
        <form action="POST" onSubmit={(event) => handleCruiseRoomPurchase(event, ship)}>
          <div ref={totalRef} className="flex justify-between items-center bg-gray-50 rounded-lg shadow-lg p-4">
            <p className="text-xl font-bold">Total <span className="text-blue-600">${grandTotalPrice}</span> incl. port fees</p>
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">Next</button>
          </div>
        </form>
        
      </div>

      {/* Price Details Section - Desktop */}
      <div className="hidden lg:block w-1/4 h-fit bg-gray-50 shadow-lg rounded-lg p-6 border">
        <h3 className="text-2xl text-blue-950 font-bold">Price Details</h3>
        <p className="text-sm text-gray-600 mb-2">{numberOfNights} Night Cruise</p>
        <div className="border-b my-2"></div>
        {Object.keys(roomQuantities).map(roomName => {
          const room = ship.Staterooms.find(room => room.Name === roomName);
          const passengers = passengerDetails[roomName];
          const quantity = roomQuantities[roomName];
          const maxOccupancy = parseInt(room["Number of Guests"].split("-")[1]);
          const baseAdultPrice = room.Price / maxOccupancy;

          // Check if it's adults-only booking with less than max occupancy
          const isUnderOccupiedAdultsOnly = 
            passengers && 
            passengers.adults < maxOccupancy && 
            passengers.teens === 0 && 
            passengers.children === 0 && 
            passengers.infants === 0;

          return roomQuantities[roomName] > 0 && (
            <div key={roomName}>
              <p className="text-gray-800 font-semibold">
                {roomName} 
                <span className="float-right">
                  ${calculateRoomPrice(room, quantity, passengers)}
                </span>
              </p>
              {!room.Name.toLowerCase().includes('studio') && passengers && (
                <div className="ml-4 text-sm text-gray-600">
                  {isUnderOccupiedAdultsOnly ? (
                    <p className="text-amber-600">
                      *Charged for full occupancy ({maxOccupancy} passengers)
                    </p>
                  ) : (
                    <>
                      {passengers.adults > 0 && (
                        <p>Adults: {passengers.adults} × ${baseAdultPrice} × {numberOfNights} nights</p>
                      )}
                      {passengers.teens > 0 && (
                        <p>Teens: {passengers.teens} × ${baseAdultPrice * 0.75} × {numberOfNights} nights</p>
                      )}
                      {passengers.children > 0 && (
                        <p>Children: {passengers.children} × ${baseAdultPrice * 0.5} × {numberOfNights} nights</p>
                      )}
                      {passengers.infants > 0 && (
                        <p>Infants: {passengers.infants} × $0</p>
                      )}
                    </>
                  )}
                </div>
              )}
              <p className="text-gray-500">Number of guests: {room["Number of Guests"]}</p>
              <p className="text-gray-500 mb-3">Decks: {room.Decks}</p>
            </div>
          );
        })}
        <div className="border-b my-2"></div>
        <p className="font-bold text-lg">
          Total for {numberOfNights} nights
          <span className="float-right text-blue-600">${grandTotalPrice}</span>
        </p>
        <p className="text-gray-500 text-sm">incl. port fees</p>
      </div>

      {/* Sliding Price Detail Panel - Mobile Only */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-gray-50 shadow-lg transform transition-transform duration-300 ease-in-out z-40 lg:hidden ${
        isPricePanelVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="px-6 py-8">
          <h3 className="text-2xl text-blue-950 font-bold">Price Details</h3>
          <p className="text-sm text-gray-600 mb-2">{numberOfNights} Night Cruise</p>
          <div className="border-b my-2"></div>
          {Object.keys(roomQuantities).map(roomName => {
            const room = ship.Staterooms.find(room => room.Name === roomName);
            const passengers = passengerDetails[roomName];
            const quantity = roomQuantities[roomName];
            const maxOccupancy = parseInt(room["Number of Guests"].split("-")[1]);
            const baseAdultPrice = room.Price / maxOccupancy;

            // Check if it's adults-only booking with less than max occupancy
            const isUnderOccupiedAdultsOnly = 
              passengers && 
              passengers.adults < maxOccupancy && 
              passengers.teens === 0 && 
              passengers.children === 0 && 
              passengers.infants === 0;

            return roomQuantities[roomName] > 0 && (
              <div key={roomName}>
                <p className="text-gray-800 font-semibold">
                  {roomName} 
                  <span className="float-right">
                    ${calculateRoomPrice(room, quantity, passengers)}
                  </span>
                </p>
                {!room.Name.toLowerCase().includes('studio') && passengers && (
                  <div className="ml-4 text-sm text-gray-600">
                    {isUnderOccupiedAdultsOnly ? (
                      <p className="text-amber-600">
                        *Charged for full occupancy ({maxOccupancy} passengers)
                      </p>
                    ) : (
                      <>
                        {passengers.adults > 0 && (
                          <p>Adults: {passengers.adults} × ${baseAdultPrice} × {numberOfNights} nights</p>
                        )}
                        {passengers.teens > 0 && (
                          <p>Teens: {passengers.teens} × ${baseAdultPrice * 0.75} × {numberOfNights} nights</p>
                        )}
                        {passengers.children > 0 && (
                          <p>Children: {passengers.children} × ${baseAdultPrice * 0.5} × {numberOfNights} nights</p>
                        )}
                        {passengers.infants > 0 && (
                          <p>Infants: {passengers.infants} × $0</p>
                        )}
                      </>
                    )}
                  </div>
                )}
                <p className="text-gray-500">Number of guests: {room["Number of Guests"]}</p>
                <p className="text-gray-500 mb-3">Decks: {room.Decks}</p>
              </div>
            );
          })}
          <div className="border-b my-2"></div>
          <p className="font-bold text-lg">
            Total for {numberOfNights} nights
            <span className="float-right text-blue-600">${grandTotalPrice}</span>
          </p>
          <p className="text-gray-500 text-sm">incl. port fees</p>
        </div>
      </div>

      {/* Floating Back to Top Button - Mobile Only - Lower z-index */}
      {showScrollButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-28 right-20 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg lg:hidden z-30"
        >
          <i className="fa-solid fa-arrow-up fa-xl"></i>
        </button>
      )}

      {/* Floating Price Detail Button - Mobile Only - Higher z-index */}
      <button
        onClick={() => setIsPricePanelVisible(!isPricePanelVisible)}
        className="fixed bottom-28 right-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 w-14 h-14 flex items-center justify-center rounded-full shadow-lg lg:hidden z-50"
      >
        <i className="fa-solid fa-calculator fa-xl"></i>
      </button>

      {/* Floating Total Price Display Section */}
      {!isFixed && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-50 border-t p-4 shadow-lg flex justify-around items-center">
          <p className="text-xl font-bold">
            Total for {numberOfNights} nights <span className="text-blue-600">${grandTotalPrice}</span> incl. port fees
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">Next</button>
        </div>
      )}
    </div>
  );
}