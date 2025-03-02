import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import BlogSection from "./BlogSection";
import './dash.css';
import Footer from "./Footer";
import SubscriptionSection from "./SubscriptionSection";
import TestimonialsSection from "./TestimonialsSection";
import RecommendedSection from "./RecommendedSection";
import NavBar from "./NavBar";
import UserChatWindow from "../Chat/UserChatWindow";
import HeroSection from "./HeroSection";
import {
  faPlaneDeparture,
  faPlaneArrival,
  faClock,
  faChair,
  faExchangeAlt,
  faDollarSign,
  faCalendarAlt,
  faUser,
  faSuitcase,
  faBriefcase,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

const UserDashboard = () => {
  const location = useLocation();
  const userData = location.state;

  useEffect(() => {
    console.log("The user data in main is ", userData.user);
  }, [userData])

  return (
    <div className="Dashboard">
      <NavBar user={userData}/>
      <HeroSection user={userData}/>
      <RecommendedSection />
      <TestimonialsSection />
      <BlogSection />
      <SubscriptionSection />
      <Footer />
      <UserChatWindow userId={userData.user.id} />
    </div>   
    
  )
}

export default UserDashboard;