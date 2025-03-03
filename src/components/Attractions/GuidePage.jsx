import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getFeedback, uploadPhotos } from "../../api/CityService";
import { saveFeedback } from "../../api/CityService";
import SubscriptionSection from "../Dashboard/SubscriptionSection";
import Footer from "../Dashboard/Footer";

import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { BentoGrid, BentoGridItem } from "../UI/Bento-Grid";
import { Button } from "../UI/moving-border";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
  IconSoup,
} from "@tabler/icons-react";

import Header from "../Cruise/CruiseHeader";
import HeaderBg from "../HeaderBg";
import worldData from "../../data/world.json";
import Blog from "../Blog";
import { ToastContainer, toast } from 'react-toastify';
import Drawer from '@mui/material/Drawer';
import { useLocation } from "react-router-dom";

export function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}

const GuidePage = () => {
  const location = useLocation();
  const [userData, setUserData] = useState(location.state || {});

  useEffect(() => {
    console.log("user in gp: ", userData.userData)
  }, [userData])

  const { countryName } = useParams();
  const [images, setImages] = useState([]);
  const [attractionImg, setAttractionImg] = useState([]);
  const [foodImg, setFoodImg] = useState([]);

  const [countryDetails, setCountryDetails] = useState(null);
  const [faqItems, setFaqItems] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const swiperRef = useRef(null);

  const [disablePrev, setDisablePrev] = useState(true);
  const [disableNext, setDisableNext] = useState(false);

  useEffect(() => {
    const fetchDestinationPhotos = async () => {
      try {
        const response = await fetch(
          `https://pixabay.com/api/?key=48405345-85a57cc4b7b58da31df054362&q=${countryName}&image_type=photo&category=place`
        );
        const data = await response.json();
        setImages(
          data.hits.length > 0 ? data.hits.map((hit) => hit.largeImageURL) : []
        );
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
      }
    };
    fetchDestinationPhotos();
  }, [countryName]);

  const fetchFoodPhoto = async (query) => {
    const apiKey = "48405345-85a57cc4b7b58da31df054362";
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.hits.length > 0) {
        setFoodImg((prev) => ({
          ...prev,
          [query]: data.hits[0].largeImageURL, // Store images using place_name as the key
        }));
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };
  const fetchDestinationPhotos = async (query) => {
    const apiKey = "48405345-85a57cc4b7b58da31df054362";
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&category=travel`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.hits.length > 0) {
        setAttractionImg((prev) => ({
          ...prev,
          [query]: data.hits[0].largeImageURL, // Store images using place_name as the key
        }));
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  // Fetch images when component mounts
  useEffect(() => {
    countryDetails?.activities?.forEach((activity) => {
      fetchDestinationPhotos(activity.place_name);
    });
  }, [countryDetails?.activities]);

  useEffect(() => {
    countryDetails?.food?.forEach((ff) => {
      fetchFoodPhoto(ff.name);
    });
  }, [countryDetails?.food]);

  useEffect(() => {
    const findCountryDetails = () => {
      let foundCountry = null;
      Object.values(worldData).forEach((continent) => {
        if (!foundCountry) {
          Object.values(continent.countries).forEach((country) => {
            if (
              country.country_name.toLowerCase() === countryName.toLowerCase()
            ) {
              foundCountry = country;
            }
          });
        }
      });
      setCountryDetails(foundCountry);
    };
    findCountryDetails();
  }, [countryName]);

  useEffect(() => {
    if (countryDetails) {
      setFaqItems([
        {
          question: "History",
          answer:
            countryDetails.cities[0]?.textual?.history[0] ||
            "No data available",
        },
        {
          question: "Currency",
          answer:
            countryDetails.cities[0]?.textual?.currency[0] ||
            "No data available",
        },
        {
          question: "Climate",
          answer:
            countryDetails.cities[0]?.textual?.climate[0] ||
            "No data available",
        },
        {
          question: "Cuisine",
          answer:
            countryDetails.cities[0]?.textual?.cuisine[0] ||
            "No data available",
        },
      ]);
    }
  }, [countryDetails]);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSlideChange = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current;
      setDisablePrev(swiper.isBeginning);
      setDisableNext(swiper.isEnd);
    }
  };

  // Bento-grid
  const Skeleton = ({ imgLink }) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
      {imgLink && (
        <img
          src={imgLink}
          alt=""
          className="w-full h-full object-cover rounded-xl"
        />
      )}
    </div>
  );

  return (
    <>
      {/* <Header user={userData}/>
      <HeaderBg title={`Travinity > Attractions > ${countryName}`}
        style={"text-sm font-semibold"}
        images={images}
        flag={true}
        height="350px"
        bgColor={"bg-gray-800 bg-opacity-80"}
      /> */}

      {/* {countryDetails && (
        <Blog countryDetail={countryDetails} images={images} />
      )} */}

      {countryDetails && (
        <>
          <div className="flex flex-row space-x-5 mr-16">
            <div className="w-3/5">
              <div className="flex flex-row items-baseline">
                <h2 className="text-blue-800 font-bold font-poppins text-5xl ml-16 mt-16">
                  {countryDetails.country_name}
                </h2>
                <span className="mt-16 ml-4 text-lg font-bold font-poppins">
                  {countryDetails.continent_name}
                </span>
              </div>
              <div className="my-7 ml-16 pr-36 font-poppins text-base text-justify text-gray-700 leading-relaxed">
                {countryDetails.blog_content}
              </div>
            </div>
            <div className="w-2/5 mr-20 mt-10">
              <div className="space-y-2 mt-10" id="accordionExample">
                {faqItems.map((item, index) => (
                  <div
                    key={index}
                    className="faq-item bg-gray-100 bg-opacity-20 shadow rounded-lg"
                  >
                    <div
                      className="faq-header py-3 px-4 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleFaq(index)}
                    >
                      <h5 className="text-sm font-poppins font-semibold text-gray-800">
                        {item.question}
                      </h5>
                      <span
                        className={`transform transition-transform duration-700 ease-in-out ${openIndex === index ? "rotate-180" : ""}`}
                      >
                        <i className="fa-solid fa-caret-down"></i>
                      </span>
                    </div>
                    <div
                      className={`faq-content overflow-hidden transition-all duration-700 ease-in-out ${openIndex === index ? "max-h-[500px] opacity-100 translate-y-0 scale-100" : "max-h-0 opacity-0 -translate-y-2 scale-95"}`}
                    >
                      <div className="p-4 border-t border-gray-200 text-gray-700">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-44 my-24 flex flex-row w-full bg-slate-100 rounded-lg">
            <div className="w-1/3 text-center flex flex-row items-center justify-center">
              <img
                src="/images/adventurer.png"
                alt="we're here"
                className="w-24 h-24 mr-5"
              />
              <div className="text-left">
                <p className="font-poppins text-lg font-semibold">
                  Explore Top Destinations
                </p>
                <p className="text-xs font-light">
                  Hidden gems, and guided exploration.
                </p>
              </div>
            </div>
            <div className="w-1/3 text-center flex flex-row items-center justify-center">
              <img
                src="/images/hobby.png"
                alt="we're here"
                className="w-24 h-24 mr-5"
              />
              <div className="text-left">
                <p className="font-poppins text-lg font-semibold">
                  Local Insights
                </p>
                <p className="text-xs font-light">
                  Expert-recommended local experiences.
                </p>
              </div>
            </div>
            <div className="w-1/3 text-center flex flex-row items-center justify-center">
              <img
                src="/images/tourist.png"
                alt="we're here"
                className="w-24 h-24 mr-5"
              />
              <div className="text-left">
                <p className="font-poppins text-lg font-semibold">
                  Breathtaking Moments
                </p>
                <p className="text-xs font-light">
                  Stunning visuals, amazing destinations.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 h-full mx-12 my-40 rounded-[40px]">
            <h1 className="bg-gradient-to-r px-16 pt-14 font-extrabold text-xl font-mono inline-block text-transparent bg-clip-text from-purple-600 via-pink-500 to-red-500">
              01 / What To Do
            </h1>
            <h1 className="font-bold text-5xl font-poppins text-gray-700 px-16 pt-5">
              {" "}
              Must Visit Destinations{" "}
            </h1>

            {/* Attractions Blogs Cards */}
            <div className="mt-16 mb-10 mx-14">
              <div className="flex gap-10 items-center">
                <div className="w-full h-full bg-transparent relative">
                  <Swiper
                    spaceBetween={40}
                    slidesPerView={3}
                    onSlideChange={handleSlideChange}
                    speed={500}
                    effect="slide"
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                  >
                    {countryDetails.activities.map((activity, index) => {
                      fetchDestinationPhotos(activity.place_name);

                      return (
                        <SwiperSlide key={index}>
                          <div className="bg-transparent rounded-2xl overflow-hidden relative group">
                            {/* Image Container */}
                            <div className="relative overflow-hidden rounded-2xl">
                              <img
                                src={attractionImg[activity.place_name]}
                                alt={activity.place_name}
                                className="w-full h-[350px] object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                              />
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl">
                                {/* Overlay Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                  <p className="text-base font-poppins font-semibold">
                                    {activity.address}
                                  </p>
                                  <p className="text-sm font-poppins font-semibold mt-2">
                                    <i className="fa-solid fa-heart-half-stroke pr-2"></i>{" "}
                                    {activity.rating}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Card Content */}
                            <div className="py-5">
                              <h3 className="text-2xl text-left font-semibold font-poppins">
                                {activity.place_name}
                              </h3>
                              <p className="text-sm text-left font-semibold font-poppins py-3">
                                {activity.city.toUpperCase()}
                              </p>
                              <p className="my-4 text-base text-gray-600">
                                {activity.description}
                              </p>
                            </div>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              </div>

              {/* Prev and Next Buttons */}
              <div className="flex justify-end mb-8 w-full pr-3">
                <button
                  className={`p-4 rounded-full border-2 mb-6 ${disablePrev ? "border-gray-300 text-gray-300 cursor-not-allowed" : "border-gray-500 text-gray-500"} transition-all`}
                  onClick={() => swiperRef.current?.slidePrev()}
                  disabled={disablePrev}
                >
                  <FaArrowLeft className="text-gray-500" />
                </button>
                <div className="mx-2"></div>
                <button
                  className={`p-4 rounded-full border-2 mb-6 ${disableNext ? "border-gray-300 text-gray-300 cursor-not-allowed" : "border-gray-500 text-gray-500"} transition-all`}
                  onClick={() => swiperRef.current?.slideNext()}
                  disabled={disableNext}
                >
                  <FaArrowRight className="text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          <div id="bento-here" className="bg-yellow-50 py-16 px-4 mx-14 mb-14 -mt-6 rounded-[40px]" >
            <div className="text-center">
              <h1 className="bg-gradient-to-r font-extrabold text-xl font-mono inline-block text-transparent bg-clip-text from-yellow-500 via-orange-400 to-red-400">
                02 / Local Food
              </h1>
              <h1 className="font-bold text-5xl font-poppins text-gray-700 pt-5">
                Must Try Food In {countryDetails.country_name}
              </h1>
            </div>

            <BentoGrid className="max-w-6xl mx-12 mt-14">
              {countryDetails.food.map((ff, i) => (
                <BentoGridItem
                  key={i} // Ensure the key is unique
                  title={ff.name}
                  description={ff.description}
                  header={<Skeleton imgLink={foodImg[ff.name]} />}
                  icon={<IconSoup className="h-4 w-4 text-neutral-500" />}
                  className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                />
              ))}
            </BentoGrid>
          </div>
        </>
      )}
      <div className={'mt-[300px]'}>
          <SubscriptionSection />
          <Footer />
      </div>

      {/* <div className="my-40 mx-16">
        {countryDetails && (
          <GridBackgroundDemo countryDetails={countryDetails} user={userData.userData}/>
        )}
      </div> */}
    </>
  );
};

// export function GridBackgroundDemo({ countryDetails, user }) {
//   const [feedbacks, setFeedbacks] = useState([]);
//   const [countryId, setCountryId] = useState(countryDetails?.country_id);
//   const [selectedFeedback, setSelectedFeedback] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [userData, setUserData] = useState(user);

//   const getFeedbackData = async (countryId) => {
//     try {
//       const { data } = await getFeedback(countryId);
//       setFeedbacks(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (countryId) {
//       getFeedbackData(countryId);
//     }
//     console.log("feedbacks are ", feedbacks)
//   }, [countryId]);

//   const splitFeedbacksIntoColumns = (feedbacks, columns) => {
//     const columnSize = Math.ceil(feedbacks.length / columns);
//     return Array.from({ length: columns }, (_, i) =>
//       feedbacks.slice(i * columnSize, (i + 1) * columnSize)
//     );
//   };

//   const shuffleArray = (array) => {
//     return array.sort(() => Math.random() - 0.5);
//   };

//   const getRandomFeedbacks = (feedbacks, count) => {
//     if (feedbacks.length > count) {
//       return shuffleArray(feedbacks).slice(0, count);
//     }
//     return feedbacks;
//   };

//   const selectedFeedbacks = useMemo(() => getRandomFeedbacks(feedbacks, 8), [feedbacks]);
//   const columns = splitFeedbacksIntoColumns(selectedFeedbacks, 4);

//   const imageStyles = [
//     [{ height: '300px' }, { height: '196px' }],
//     [{ height: '233px' }, { height: '334px' }],
//     [{ height: '331px' }, { height: '182px' }],
//     [{ height: '165px' }, { height: '400px' }],
//   ];

//   const handleImageClick = (feedback) => {
//     setSelectedFeedback(feedback);
//     setDrawerOpen(true);
//   };

//   const closeDrawer = () => {
//     setDrawerOpen(false);
//   };

//   return (
//     <div className="h-full w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative text-center">
//       <h1 className="bg-gradient-to-r font-extrabold text-xl mt-14 z-30 font-mono inline-block text-transparent bg-clip-text from-blue-800 to-pink-900">
//         03 / Through Travellers' Eye
//       </h1>

//       <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] z-10"></div>

//       <p className="text-3xl sm:text-6xl font-poppins font-semibold relative z-30 bg-clip-text text-transparent bg-gradient-to-t from-neutral-500 to-neutral-800 py-4">
//         Travellers' Moments
//       </p>

//       <MovingBorderDemo countryDetails={countryDetails} user={userData} />

//       {/* Gallery grid */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 z-20 relative mx-16 mt-16">
//         {columns.map((column, columnIndex) => (
//           <div key={columnIndex} className="grid gap-4">
//             {column.map((feedback, feedbackIndex) => (
//               <div key={feedback.id} className="relative group cursor-pointer" onClick={() => handleImageClick(feedback)}>
//                 <img
//                   className="rounded-lg"
//                   style={{
//                     width: '239px',
//                     ...imageStyles[columnIndex][feedbackIndex],
//                     objectFit: 'cover',
//                   }}
//                   src={feedback.photoUrl}
//                   alt={feedback.caption}
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
//                   <p className="text-white text-sm font-semibold">{feedback.caption}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>

//       <Drawer
//         anchor="right"
//         open={drawerOpen}
//         onClose={closeDrawer}
//         PaperProps={{
//           style: {
//             transition: 'transform 1s ease-in-out',
//             transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
//           },
//         }}
//       >
//         <div style={{ width: 400, padding: 20, position: 'relative' }}>
//           {selectedFeedback && (
//             <>
//               <img
//                 src={selectedFeedback.photoUrl}
//                 alt={selectedFeedback.caption}
//                 style={{ width: '100%', borderRadius: '8px' }}
//               />
//               <h2 className="text-gray-700 font-bold text-xl font-poppins mt-6">
//                 {selectedFeedback.caption}
//               </h2>
//               <p className="text-gray-700 font-poppins mt-4 text-xs mb-40">
//                 {selectedFeedback.body}
//               </p>
//             </>
//           )}
//           <button onClick={closeDrawer} style={{ position: 'absolute', left: 20, bottom: 20 }}>
//             Close
//           </button>
//         </div>
//       </Drawer>

//       {feedbacks && (
//         <h1> {countryId} </h1>
//       )}
//     </div>
//   );
// }

// export function MovingBorderDemo({ countryDetails, user }) {
//   const [userData, setUserData] = useState(user);
//   const country_id = countryDetails?.country_id;
//   const dialogCard = useRef(null);
//   const fileInputRef = useRef(null);
//   const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
//   const [file, setFile] = useState(null);

//   const [values, setValues] = useState({
//     caption: "",
//     body: "",
//     user: {
//       id: userData.id,
//     },
//     countryId: country_id,
//   });

//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [drawerContent, setDrawerContent] = useState({});

//   const onChange = (event) => {
//     setValues({
//       ...values,
//       [event.target.name]: event.target.value,
//     });
//     console.log(values);
//   };

//   const toastConfig = {
//     autoClose: 1500,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//     theme: "light",
//   };

//   const toastSuccess = (message) => {
//     toast.success(message, toastConfig);
//   };
//   const toastError = (message) => {
//     toast.error(message, toastConfig);
//   };

//   const toggleModal = (flag) => {
//     if (flag) {
//       dialogCard.current.showModal();
//     } else {
//       dialogCard.current.close();
//       setImagePreviewUrl(null);
//       setValues({
//         caption: "",
//         body: "",
//         user: {
//           id: 1,
//         },
//         countryId: country?.country?.country?.country_id,
//       });
//     }
//   };

//   const handleFileChange = (event) => {
//     console.log("File input changed");
//     const file = event.target.files[0];

//     if (!file) {
//       console.log("No file selected");
//       return;
//     }

//     const maxSize = 15 * 1024 * 1024;

//     if (!file.type.startsWith("image/")) {
//       console.log("File is not an image:", file.name);
//       toastError(`File \"${file.name}\" is not an image`);
//       fileInputRef.current.value = "";
//       return;
//     }

//     if (file.size > maxSize) {
//       console.log("File size is too large:", file.name);
//       toastError(`Image \"${file.name}\" size is larger than 15MB`);
//       fileInputRef.current.value = "";
//       return;
//     }

//     const imageUrl = URL.createObjectURL(file);
//     setImagePreviewUrl(imageUrl);
//     setFile(file);
    
//     toastSuccess("Image uploaded successfully");
//   };

//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const { data } = await saveFeedback(values);

//       console.log(file.name);

//       const formData = new FormData();
//       formData.append("id", data.id);
//       formData.append("file", file, file.name);

//       console.log("The formdata is ", formData);

//       const { data: filePaths } = await uploadPhotos(formData);
//       console.log("Uploaded file paths:", filePaths);

//       toastSuccess("Your moment has been successfully saved!");
//     } catch (error) {
//       console.error("Error:", error.message);
//       toastError(error.message);
//     }

//     toggleModal(false);
//   };

//   const handleImageClick = (image, caption, body) => {
//     setDrawerContent({ image, caption, body });
//     setDrawerOpen(true);
//   };

//   const closeDrawer = () => {
//     setDrawerOpen(false);
//   };

//   return (
//     <div>
//       <Button onClick={() => toggleModal(true)} borderRadius="1.75rem" className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 hover:bg-sky-200 duration-300 transition-colors">
//         Click to share your moments
//       </Button>

//       <dialog ref={dialogCard} className="bg-gray-50 w-[90%] p-6 rounded-lg shadow-lg backdrop:bg-black backdrop:opacity-50 text-left" >
//         <div className="px-6 py-6 space-y-4">
//           <p> Trip ≻ Destinations ≻ Moments </p>
//           <p className="text-xl font-semibold font-poppins pt-4"> Add A Trip Moment </p>

//           <form onSubmit={handleFormSubmit} className="space-y-4" encType="multipart/form-data">
//             <p
//               onMouseEnter={() => setTooltipVisible(true)}
//               onMouseLeave={() => setTooltipVisible(false)}
//               className="relative inline-flex items-center cursor-pointer"
//             >
//               Share your photos {country_id} <i className="fa-solid fa-circle-question pl-3" style={{ color: "#4d4c47" }} />
//             </p>

//             <div className="flex flex-row gap-4">
//               <div className="rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36 h-32 flex items-center justify-center">
//                 <label htmlFor="upload" className="flex flex-col items-center gap-2 cursor-pointer" >
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 fill-white stroke-indigo-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" >
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   <span className="text-gray-600 font-medium text-xs">Upload file</span>
//                 </label>
//                 <input id="upload" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
//               </div>

//               {imagePreviewUrl && (
//                 <div className="relative rounded-md border border-indigo-500 bg-gray-50 p-4 shadow-md w-36 h-32 flex items-center justify-center">
//                   <button onClick={() => {
//                       setImagePreviewUrl(null);
//                       fileInputRef.current.value = "";
//                     }}
//                     className="absolute -top-2 -right-2 rounded-full w-6 h-6 flex items-center justify-center"
//                   >
//                     <i className="fa-solid fa-circle-xmark text-xl"></i>
//                   </button>
//                   <img src={imagePreviewUrl} alt="Preview" className="max-w-full max-h-full rounded-lg" />
//                 </div>
//               )}
//             </div>

//             <div className="space-y-3">
//               <label className="relative items-center block mt-10"> Add a Caption </label>
//               <input type="text" name="caption" value={values.caption} onChange={onChange} placeholder="Add your unique captions" className="border-b border-gray-300 bg-transparent text-base w-full outline-none focus:ring-0" />
//             </div>

//             <div className="space-y-3">
//               <label className="relative items-center block mt-10">
//                 Share your unique experience with us
//               </label>
//               <textarea name="body" value={values.body} onChange={onChange} id="hs-textarea-autoheight-to-destroy" className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600" ></textarea>
//             </div>

//             <div className="flex flex-row space-x-4 justify-end mt-8">
//               <button type="button" onClick={() => toggleModal(false)} className="px-4 py-2 rounded-xl border border-neutral-600 text-black bg-white hover:bg-gray-100 transition duration-200" >
//                 Cancel
//               </button>
//               <button type="submit" className="px-4 py-2 rounded-xl border border-neutral-600 text-white bg-gray-500 hover:bg-gray-600 transition duration-200" >
//                 Submit
//               </button>
//             </div>
//           </form>
//         </div>
//         <ToastContainer />
//       </dialog>

//       <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}
//         PaperProps={{
//           style: {
//             transition: 'transform 0.3s ease-in-out',
//             transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
//           },
//         }}
//       >
//         <div style={{ width: 300, padding: 20 }}>
//           <Button onClick={closeDrawer} style={{ float: 'right' }}>Close</Button>
//           <img src={drawerContent.image} alt={drawerContent.caption} style={{ width: '100%', borderRadius: '8px' }} />
//           <h2>{drawerContent.caption}</h2>
//           <p>{drawerContent.body}</p>
//         </div>
//       </Drawer>
//     </div>
//   );
// }

// Sidebar component
const Sidebar = ({ feedback, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-lg">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
        <i className="fa-solid fa-times"></i>
      </button>
      <img src={feedback.photoUrl} alt={feedback.caption} className="w-full h-64 object-cover rounded-lg mb-4" />
      <h2 className="text-xl font-bold mb-2">{feedback.caption}</h2>
      <p className="text-gray-700">{feedback.body}</p>
    </div>
  </div>
);

export default GuidePage;
