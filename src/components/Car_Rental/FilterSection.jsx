import React, { useState } from 'react';

const FilterSection = ({ orgDataFromAPI, currentCarDetail, activeFilters, extractCarOnFilter, priceFilter, reviewFilter, typeFilter }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <> 
      {orgDataFromAPI.length > 0 && (
        <div>
          <button
            onClick={toggleFilterVisibility}
            className="md:hidden w-full p-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg mb-4 shadow-lg transform transition-transform duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Filter Section Content */}
          <div
              id="filter-section"
              className={`w-full md:w-72 p-4 md:p-8 rounded-lg shadow-md bg-white transition-all duration-300 overflow-hidden ${
                isFilterVisible ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 md:max-h-screen md:opacity-100'
              }`}
            >
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-poppins font-semibold'> Filter </h3>
              <p className='text-blue-500 text-xs text-right font-poppins'> Clear all filter </p>
            </div>
            <hr className='my-5 border-t-1 border-gray-300'/>

            {/* Price Filter */}
            <div className='space-y-1'>
              <h3 className='text-sm font-poppins font-semibold'> Price </h3>
              <div className='flex flex-col space-y-1'>
                <label className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input type="checkbox" name="firstRange" checked={activeFilters.price === "200-300"} onChange={() => extractCarOnFilter("price", "200-300")}  />
                    <span className="text-sm font-poppins ml-2"> $200 - $300</span>
                  </div>
                  <p className="text-xs font-poppins font-semibold">{priceFilter.first}</p>
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input type="checkbox" name="secondRange" checked={activeFilters.price === "300-400"} onChange={() => extractCarOnFilter("price", "300-400")} />
                    <span className="text-sm font-poppins ml-2"> $300 - $400</span>
                  </div>
                  <p className="text-xs font-poppins font-semibold">{priceFilter.second}</p>
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input type="checkbox" name="thirdRange" checked={activeFilters.price === "400-500"} onChange={() => extractCarOnFilter("price", "400-500")} />
                    <span className="text-sm font-poppins ml-2"> $400 - $500</span>
                  </div>
                  <p className="text-xs font-poppins font-semibold">{priceFilter.third}</p>
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="fourthRange"
                      checked={activeFilters.price === "500-600"}
                      onChange={() => extractCarOnFilter("price", "500-600")}
                    />
                    <span className="text-sm font-poppins ml-2"> $500 - $600</span>
                  </div>
                  <p className="text-xs font-poppins font-semibold">{priceFilter.fourth}</p>
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="fifthRange"
                      checked={activeFilters.price === "600"}
                      onChange={() => extractCarOnFilter("price", "600")}
                    />
                    <span className="text-sm font-poppins ml-2">$600+</span>
                  </div>
                  <p className="text-xs font-semibold font-poppins">{priceFilter.fifth}</p>
                </label>
              </div>
            </div>
            <hr className='my-5 border-t-1 border-gray-300'/>

            {/* Review Score Filter */}
            <div className='space-y-1'>
              <h3 className='text-sm font-poppins font-semibold'> Review Score </h3>
              <div className='flex flex-col space-y-1'>
                <label className="flex items-center justify-between"> 
                  <div className="flex items-center">
                    <input type="checkbox" name="super" checked={activeFilters.rating === "super"} onChange={() => extractCarOnFilter("rating", "super")} />
                    <span className="text-sm font-poppins ml-2">Super : 9+</span>
                  </div>
                  <p className="text-xs font-semibold font-poppins">{reviewFilter.super}</p>
                </label>
                <label className="flex items-center justify-between"> 
                  <div className="flex items-center">
                    <input type="checkbox" name="vgood" checked={activeFilters.rating === "vgood"} onChange={() => extractCarOnFilter("rating", "vgood")} />
                    <span className="text-sm font-poppins ml-2">Very good : 8+</span>
                  </div>
                  <p className="text-xs font-semibold font-poppins">{reviewFilter.vgood}</p>
                </label>
                <label className="flex items-center justify-between"> 
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="good"
                      checked={activeFilters.rating === "good"}
                      onChange={() => extractCarOnFilter("rating", "good")} 
                    />
                    <span className="text-sm font-poppins ml-2">Good : 7+</span>
                  </div>
                  <p className="text-xs font-semibold font-poppins">{reviewFilter.good}</p>
                </label>
              </div>
            </div>
            <hr className='my-5 border-t-1 border-gray-300'/>

            {/* Car Categories Filter */}
            <div className='space-y-1'>
              <h3 className='text-sm font-poppins font-semibold'> Car Categories </h3>
              <div className='flex flex-col space-y-1'>
                <label className="flex items-center justify-between"> 
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="mini"
                      checked={activeFilters.type === "Mini"}
                      onChange={() => extractCarOnFilter("type", "Mini")} 
                    />
                    <span className="text-sm font-poppins ml-2">Mini</span>
                  </div>
                  <p className="text-xs font-semibold font-poppins">{typeFilter.Mini}</p>
                </label>
                <label className="flex items-center justify-between"> 
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="economy"
                      checked={activeFilters.type === "Economy"}
                      onChange={() => extractCarOnFilter("type", "Economy")} 
                    />
                    <span className="text-sm font-poppins ml-2">Economy</span>
                  </div>
                  <p className="text-xs font-semibold font-poppins">{typeFilter.Economy}</p>
                </label>
                <label className="flex items-center justify-between"> 
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="compact"
                      checked={activeFilters.type === "Compact"}
                      onChange={() => extractCarOnFilter("type", "Compact")}
                    />
                    <span className="text-sm font-poppins ml-2">Compact</span>
                  </div>
                  <p className="text-xs font-semibold font-poppins">{typeFilter.Compact}</p>
                </label>
                <label className="flex items-center justify-between"> 
                  <div className="flex items-center">
                    <input type="checkbox" name="Intermediate" checked={activeFilters.type === "Intermediate"} onChange={() => extractCarOnFilter("type", "Intermediate")} />
                    <span className="text-sm font-poppins ml-2">Intermediate</span>
                  </div>
                  <p className="text-xs font-semibold font-poppins">{typeFilter.Intermediate}</p>
                </label>
                <label className="flex items-center justify-between"> 
                  <div className="flex items-center">
                    <input type="checkbox" name="standard" checked={activeFilters.type === "Standard"} onChange={() => extractCarOnFilter("type", "Standard")}  />
                    <span className="text-sm font-poppins ml-2">Standard</span>
                  </div>
                  <p className="text-xs font-semibold font-poppins">{typeFilter.Standard}</p>
                </label>
                <label className="flex items-center justify-between"> 
                  <div className="flex items-center">
                    <input type="checkbox" name="full_size" checked={activeFilters.type === "Full-size"} onChange={() => extractCarOnFilter("type", "Full-size")}  />
                    <span className="text-sm font-poppins ml-2">Full-size</span>
                  </div>
                  <p className="text-xs font-semibold font-poppins">{typeFilter.Full_size}</p>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterSection;