import React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import Attracts_main from "../Attractions/attracts_main";
import AITravelFeatures from "../AI/AITravelFeatures";

const UserDashboard = () => {
  const location = useLocation();
  const userData = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/log_in", { replace: true });
    } else {
      console.log("The user data in main is ", userData.user);
    }
  }, [userData, navigate]);

  if (!userData) return null;

  return (
    <div className="Dashboard">
      <NavBar user={userData}/>
      <HeroSection user={userData}/>
      <AITravelFeatures userMBTI={userData.user.mbti} /> 
      <RecommendedSection />
      <TestimonialsSection />
      <Attracts_main user={userData}/>
      <BlogSection />
      <SubscriptionSection />
      <Footer />
      <UserChatWindow userId={userData.user.id} />
    </div>   
    
  )
}

export default UserDashboard;