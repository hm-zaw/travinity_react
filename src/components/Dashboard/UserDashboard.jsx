import React from "react";
import BlogSection from "./BlogSection";
import './dash.css';
import Footer from "./Footer";
import SubscriptionSection from "./SubscriptionSection";
import TestimonialsSection from "./TestimonialsSection";
import RecommendedSection from "./RecommendedSection";
import NavBar from "./NavBar";
import HeroSection from "./HeroSection";


const UserDashboard = () => {
  return (
    <div className="Dashboard">
      <NavBar />
      <HeroSection />
      <RecommendedSection />
      <TestimonialsSection />
      <BlogSection />
      <SubscriptionSection />
      <Footer />
    </div>   
    
  )
}

export default UserDashboard;