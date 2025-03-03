import React, { useState, useEffect } from "react";
import "../../index.css";
import worldData from "../../data/world.json";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CardGrids = (user) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(user.user);
  const getRandomCountries = (countries) => {
    const shuffled = [...countries].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 7);
  };

  const continents = Object.values(worldData);
  const allCountries = continents.flatMap((continent) =>
    Object.values(continent.countries)
  );

  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    setSelectedCountries(getRandomCountries(allCountries));
  }, []);

  const [images, setImages] = useState({}); // Store images for each country

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      for (const country of selectedCountries) {
        try {
          const response = await fetch(
            `https://pixabay.com/api/?key=48405345-85a57cc4b7b58da31df054362&q=${country.country_name}&image_type=photo&category=cities`
          );
          const data = await response.json();
          if (data.hits.length > 0) {
            newImages[country.country_name] = data.hits[4].largeImageURL;
          } else {
            newImages[country.country_name] = ""; // Default fallback
          }
        } catch (error) {
          console.error("Error fetching image:", error);
          newImages[country.country_name] = "";
        }
      }
      setImages(newImages);
    };

    if (selectedCountries.length > 0) {
      fetchImages();
    }
  }, [selectedCountries]);

  const truncateText = (text, wordLimit) => {
    const words = text.split(" ");
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(" ") + " ...";
    }
    return text;
  };

  return (
    <>
    <div className="flex flex-col bg-white mx-auto my-12 p-auto relative card-container">
      <div className="flex overflow-x-scroll pb-10 hide-scroll-bar">
        <div className="flex flex-nowrap lg:ml-24 md:ml-20 ml-10">
          {selectedCountries.map((country, index) => {
            const flagUrl = `https://flagcdn.com/w80/${country.country_id.toLowerCase()}.png`;
            const backgroundUrl = images[country.country_name];

            return (
              <div key={index} href="#" 
                onClick={() =>
                  navigate(`/attractions/${country.country_name}`, {
                    state: { userData },
                  })
                }
                className="group relative block w-72 h-72 sm:h-96 lg:h-[380px] mx-4 mt-4 overflow-hidden rounded-xl shadow-lg transition-transform transform hover:scale-105" >
                <div className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 group-hover:opacity-80"  style={{ backgroundImage: `url(${backgroundUrl})` }} ></div>

                <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                <div className="relative flex flex-col justify-end h-full pb-6 pr-8 transition-opacity duration-300">
                  <div className="flex items-center space-x-4 py-1 w-full backdrop-blur-md bg-white/10 rounded-md">
                    
                    <h2 className="text-xl mx-2 pl-4 font-semibold sm:text-2xl whitespace-nowrap text-white">
                      {country.country_name}
                    </h2>
                    <img src={flagUrl} alt={`${country.country_name} flag`} className="w-8 h-8 object-contain" />
                  </div>

                  <p className="mt-4 pl-6 text-sm sm:text-base text-white">
                    {truncateText(country.cities["0"].textual.history["0"], 8)}
                  </p>

                  <p className="mt-6 pl-6 text-white font-bold underline cursor-pointer">
                    Read more
                  </p>
                </div>
              </div>
            );
          })}

          <div className="group relative block w-72 h-80 sm:h-96 lg:h-[380px] mx-4 mt-4 overflow-hidden rounded-xl shadow-lg transition-transform transform hover:scale-105 bg-gradient-to-b from-blue-300 to-blue-500">
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 group-hover:opacity-80"
              style={{
                backgroundImage: `url(https://ak-s.tripcdn.com/modules/ibu/online-home/21d5d0cbda68ced25672da1ecbad9aac.21d5d0cbda68ced25672da1ecbad9aac.png)`,
              }}
            ></div>

            <div id="textDiv" className="absolute inset-x-0 bottom-0 flex flex-col justify-center items-center text-center text-white p-6 bg-gradient-to-t from-black/60 via-black/40 to-transparent" >
              <h2 className="text-xl sm:text-2xl font-semibold">
                Explore more popular destinations
              </h2>
              <button className="mt-4 w-full text-sm bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                GO NOW
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* <div className="flex flex-col bg-white mx-auto my-12 p-auto relative">
      <div className="flex overflow-x-scroll pt-2 pb-10 hide-scroll-bar">
        <div className="flex flex-nowrap lg:ml-24 md:ml-20 ml-10">
          {selectedCountries.map((country, index) => {
            const flagUrl = `https://flagcdn.com/w80/${country.country_id.toLowerCase()}.png`;
            const backgroundUrl = images[country.country_name];

            return (
              <a key={index} href="#" className="group relative block w-72 h-64 sm:h-80 lg:h-96 mx-4">
                <span className="absolute inset-0 border-2 border-dashed border-black rounded-xl"></span>
            
                <div className="relative flex h-full transform items-end bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2 rounded-xl shadow-md" style={{ backgroundImage: `url(${backgroundUrl})`, backgroundSize: "cover", backgroundPosition: "center", }} >
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl"></div>
            
                  <div className="relative flex flex-col justify-end h-full p-6 transition-opacity duration-300">
                    <div className="flex items-center space-x-4 bg-opacity-30 px-1 py-1.5 rounded-lg backdrop-blur-md">
                      <h2 className="text-xl font-semibold sm:text-2xl whitespace-nowrap text-white">
                        {country.country_name}
                      </h2>
                      <img src={flagUrl} alt={`${country.country_name} flag`} className="w-8 h-8 object-contain" />
                    </div>
            
                    <p className="mt-4 text-sm sm:text-base text-white">
                      {truncateText(country.history, 8)}
                    </p>
            
                    <p className="mt-6 text-white font-bold underline cursor-pointer">
                      Read more
                    </p>
                  </div>
                </div>
              </a>
            );
            
          })}
        </div>
      </div>
    </div> */}


    </>
  );
};

export default CardGrids;
