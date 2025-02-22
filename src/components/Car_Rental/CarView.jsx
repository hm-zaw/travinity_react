import React, { useEffect, useState } from "react";
import { getCar } from "../../api/CarService";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

const CarView = () => {
  const [car, setCar] = useState({
    v_id: "",
    name: "",
    group: "",
    seats: "",
    doors: "",
    bigCase: "",
    smallCase: "",
    img: "",
    supplier: "",
    avg_rating: "",
    efficiency_rating: "",
    price: "",
    transmission: "",
    pickup: "",
  });

  useEffect(() => {
    console.log(car);
  }, [car]);

  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const key = searchParams.get("skey");

  const getCarDetails = async () => {
    try {
      const carData = await getCar({ id, key });
      setCar(carData.data); 
    } catch (error) {
      console.error("Error fetching car details:", error);
    }
  };

  useEffect(() => {
    getCarDetails();
  }, [id, key]); 

  return (
    <>
      <h2>{car.v_name}</h2>
      <p>{car.price}</p>
      <img src={car.img} alt="" />

      <Link to={'/'}>
        Back to Home
      </Link>
    </>
  );
};

export default CarView;
