import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { HeatMap } from '@nivo/heatmap';
import { scaleLinear } from 'd3-scale';

// Update the MBTI compatibility matrix with all 16 types
const mbtiCompatibility = {
  INTJ: { ENTP: 0.9, INTP: 0.85, ENTJ: 0.8, INFJ: 0.7, ENFP: 0.6 },
  INTP: { ENTJ: 0.9, ENTP: 0.85, INTJ: 0.8, INFJ: 0.7, ENFP: 0.6 },
  ENTJ: { INTP: 0.9, INTJ: 0.85, ENTP: 0.8, ENFJ: 0.7, INFJ: 0.6 },
  ENTP: { INTJ: 0.9, INTP: 0.85, ENTJ: 0.8, INFJ: 0.7, ENFP: 0.6 },
  INFJ: { ENTP: 0.9, ENFP: 0.85, INTJ: 0.8, ENTJ: 0.7, INTP: 0.6 },
  INFP: { ENFJ: 0.9, ENFP: 0.85, INFJ: 0.8, ENTP: 0.7, INTJ: 0.6 },
  ENFJ: { INFP: 0.9, ENFP: 0.85, INFJ: 0.8, ENTP: 0.7, INTJ: 0.6 },
  ENFP: { INFJ: 0.9, ENFJ: 0.85, ENTP: 0.8, INTJ: 0.7, INTP: 0.6 },
  ISTJ: { ESTP: 0.9, ISTP: 0.85, ESTJ: 0.8, ISFJ: 0.7, ESFP: 0.6 },
  ISFJ: { ESFJ: 0.9, ESTJ: 0.85, ISTJ: 0.8, ESTP: 0.7, ISTP: 0.6 },
  ESTJ: { ISTJ: 0.9, ISTP: 0.85, ESTP: 0.8, ESFJ: 0.7, ISFJ: 0.6 },
  ESFJ: { ISFJ: 0.9, ESTJ: 0.85, ISTJ: 0.8, ESTP: 0.7, ISTP: 0.6 },
  ISTP: { ESTP: 0.9, ISTJ: 0.85, ESTJ: 0.8, ISFP: 0.7, ESFP: 0.6 },
  ISFP: { ESFP: 0.9, ESTP: 0.85, ISTP: 0.8, ISFJ: 0.7, ESFJ: 0.6 },
  ESTP: { ISTP: 0.9, ESFP: 0.85, ESTJ: 0.8, ISTJ: 0.7, ISFP: 0.6 },
  ESFP: { ISFP: 0.9, ESTP: 0.85, ESFJ: 0.8, ISTP: 0.7, ISFJ: 0.6 }
};

// Update vector representation with all MBTI types
const mbtiVectors = {
  INTJ: [1, -1, 1, -1],
  INTP: [1, -1, 1, 1],
  ENTJ: [-1, -1, 1, -1],
  ENTP: [-1, -1, 1, 1],
  INFJ: [1, -1, -1, -1],
  INFP: [1, -1, -1, 1],
  ENFJ: [-1, -1, -1, -1],
  ENFP: [-1, -1, -1, 1],
  ISTJ: [1, 1, 1, -1],
  ISFJ: [1, 1, -1, -1],
  ESTJ: [-1, 1, 1, -1],
  ESFJ: [-1, 1, -1, -1],
  ISTP: [1, 1, 1, 1],
  ISFP: [1, 1, -1, 1],
  ESTP: [-1, 1, 1, 1],
  ESFP: [-1, 1, -1, 1]
};

// Update calculateCosineSimilarity function to handle arrays
const calculateCosineSimilarity = (mbti1, mbti2) => {
  const vector1 = mbtiVectors[mbti1];
  const vector2 = mbtiVectors[mbti2];
  
  if (!vector1 || !vector2) return 0;
  
  const dotProduct = vector1.reduce((acc, val, i) => acc + val * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((acc, val) => acc + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((acc, val) => acc + val * val, 0));
  
  return dotProduct / (magnitude1 * magnitude2);
};

const destinationStats = {
  cultural: {
    Paris: { visits: 1200, rating: 4.8, cost: 2500 },
    Rome: { visits: 980, rating: 4.7, cost: 2200 },
    Kyoto: { visits: 850, rating: 4.9, cost: 3000 },
    Istanbul: { visits: 760, rating: 4.6, cost: 1800 },
  },
  adventure: {
    Bali: { visits: 1100, rating: 4.7, cost: 2000 },
    Nepal: { visits: 680, rating: 4.8, cost: 1500 },
    CostaRica: { visits: 890, rating: 4.6, cost: 2300 },
    NewZealand: { visits: 920, rating: 4.9, cost: 3500 },
  },
  relaxation: {
    Maldives: { visits: 780, rating: 4.9, cost: 4000 },
    Santorini: { visits: 850, rating: 4.8, cost: 3200 },
    Bora_Bora: { visits: 560, rating: 4.9, cost: 5000 },
    Cancun: { visits: 1100, rating: 4.5, cost: 2800 },
  }
};

const getMBTIDescription = (mbti) => {
  const descriptions = {
    INTJ: "The Strategic Planner - Loves well-organized cultural trips",
    INTP: "The Analytical Explorer - Seeks intellectual and scientific destinations",
    ENTJ: "The Travel Executive - Efficiently maximizes travel experiences",
    ENTP: "The Innovation Seeker - Thrives on unique, unconventional adventures",
    INFJ: "The Cultural Connector - Drawn to meaningful, authentic experiences",
    INFP: "The Idealistic Wanderer - Seeks personal growth through travel",
    ENFJ: "The Travel Mentor - Creates harmonious group experiences",
    ENFP: "The Enthusiastic Adventurer - Loves spontaneous, people-focused trips",
    ISTJ: "The Traditional Tourist - Appreciates structured, historical tours",
    ISFJ: "The Caring Explorer - Values comfortable, meaningful journeys",
    ESTJ: "The Travel Manager - Organizes practical, efficient itineraries",
    ESFJ: "The Social Traveler - Creates inclusive group experiences",
    ISTP: "The Adventurous Craftsman - Seeks hands-on travel experiences",
    ISFP: "The Artistic Nomad - Drawn to aesthetic and sensory experiences",
    ESTP: "The Dynamic Adventurer - Lives for exciting, action-packed trips",
    ESFP: "The Social Butterfly - Enjoys lively, entertaining destinations"
  };
  return descriptions[mbti] || "Versatile Explorer";
};

const getTravelStyle = (mbti) => {
  const styles = {
    INTJ: ["Museums and cultural sites", "Quiet historical locations", "Strategic sightseeing"],
    INTP: ["Science museums", "Ancient ruins", "Technology hubs"],
    ENTJ: ["Business districts", "Luxury experiences", "Efficient city tours"],
    ENTP: ["Off-beaten paths", "Local innovations", "Unique experiences"],
    INFJ: ["Cultural workshops", "Spiritual retreats", "Authentic local experiences"],
    INFP: ["Art galleries", "Nature retreats", "Poetry cafes"],
    ENFJ: ["Group tours", "Cultural exchanges", "Community events"],
    ENFP: ["Festival circuits", "Creative spaces", "Spontaneous adventures"],
    ISTJ: ["Historical tours", "Traditional experiences", "Organized trips"],
    ISFJ: ["Local communities", "Comfortable accommodations", "Cultural preservation"],
    ESTJ: ["Structured tours", "Time-efficient routes", "Classic attractions"],
    ESFJ: ["Group activities", "Popular destinations", "Social gatherings"],
    ISTP: ["Adventure sports", "Technical museums", "Hands-on experiences"],
    ISFP: ["Art districts", "Nature photography", "Local crafts"],
    ESTP: ["Extreme sports", "Urban exploration", "Active adventures"],
    ESFP: ["Entertainment venues", "Social hotspots", "Popular attractions"]
  };
  return styles[mbti] || ["Flexible itineraries", "Mixed experiences", "Various activities"];
};

const getDestinationMatch = (mbti) => {
  const matches = {
    ENFJ: [
      "Barcelona",
      "Rio de Janeiro",
      "Sydney",
      "Kyoto",
      "Amsterdam",
      "Cape Town",
      "Marrakech",
      "Dublin",
      "Vancouver",
      "Stockholm",
      "Vienna",
      "Buenos Aires",
      "Seoul",
      "Montreal",
      "Edinburgh"
    ],
    INTJ: ["Vienna", "Edinburgh", "Kyoto"],
    INTP: ["Berlin", "Silicon Valley", "Cambridge"],
    ENTJ: ["Singapore", "Dubai", "New York"],
    ENTP: ["Amsterdam", "San Francisco", "Bangkok"],
    INFJ: ["Ubud", "Kyoto", "Prague"],
    INFP: ["Paris", "Venice", "Copenhagen"],
    ISTJ: ["London", "Washington DC", "Munich"],
    ISFJ: ["Charleston", "Copenhagen", "Kyoto"],
    ESTJ: ["Geneva", "Singapore", "Toronto"],
    ESFJ: ["Rome", "Barcelona", "Vienna"],
    ISTP: ["Queenstown", "Alaska", "Swiss Alps"],
    ISFP: ["Florence", "Santorini", "Chiang Mai"],
    ESTP: ["Las Vegas", "Dubai", "Queenstown"],
    ESFP: ["Ibiza", "Rio de Janeiro", "Miami"]
  };
  return matches[mbti] || ["Paris", "London", "Tokyo"];
};

const tripDatabase = {
  cultural: [
    {
      destination: "Paris",
      type: "Cultural",
      features: [0.9, 0.7, 0.8, 0.6],
      highlights: ["Louvre Museum", "Eiffel Tower", "Notre-Dame"],
      bestSeasons: ["Spring", "Fall"],
      avgCost: 2500,
      idealDuration: "5-7 days",
      localCuisine: ["French Pastries", "Fine Dining", "Wine Tasting"],
      activities: ["Art Gallery Tours", "Historical Walks", "River Seine Cruise"]
    },
    {
      destination: "Kyoto",
      type: "Cultural",
      features: [0.8, 0.9, 0.7, 0.8],
      highlights: ["Fushimi Inari Shrine", "Kinkaku-ji", "Gion District"],
      bestSeasons: ["Spring", "Fall"],
      avgCost: 3000,
      idealDuration: "4-6 days",
      localCuisine: ["Traditional Tea Ceremony", "Kaiseki", "Matcha Sweets"],
      activities: ["Temple Visits", "Geisha District Tours", "Garden Walks"]
    },
    {
      destination: "Rome",
      type: "Cultural",
      features: [0.9, 0.8, 0.7, 0.9],
      highlights: ["Colosseum", "Vatican Museums", "Roman Forum"],
      bestSeasons: ["Spring", "Fall"],
      avgCost: 2700,
      idealDuration: "5-7 days",
      localCuisine: ["Authentic Pasta", "Roman Pizza", "Gelato"],
      activities: ["Ancient Ruins Tours", "Vatican Visit", "Food Tours"]
    },
    {
      destination: "Istanbul",
      type: "Cultural",
      features: [0.8, 0.9, 0.7, 0.8],
      highlights: ["Hagia Sophia", "Blue Mosque", "Grand Bazaar"],
      bestSeasons: ["Spring", "Fall"],
      avgCost: 1800,
      idealDuration: "4-6 days",
      localCuisine: ["Turkish Kebabs", "Baklava", "Turkish Coffee"],
      activities: ["Historical Tours", "Bosphorus Cruise", "Bazaar Shopping"]
    },
    {
      destination: "Barcelona",
      type: "Cultural",
      features: [0.9, 0.8, 0.7, 0.9],
      highlights: ["Sagrada Familia", "Gothic Quarter", "Park Güell"],
      bestSeasons: ["Spring", "Fall"],
      avgCost: 2400,
      idealDuration: "5-7 days",
      localCuisine: ["Tapas", "Paella", "Catalan Wine"],
      activities: ["Architecture Tours", "Local Markets", "Cultural Festivals"]
    },
    {
      destination: "Rio de Janeiro",
      type: "Cultural",
      features: [0.8, 0.9, 0.7, 0.8],
      highlights: ["Christ the Redeemer", "Copacabana", "Sugarloaf Mountain"],
      bestSeasons: ["December-March"],
      avgCost: 2200,
      idealDuration: "7-10 days",
      localCuisine: ["Feijoada", "Churrasco", "Caipirinha"],
      activities: ["Samba Classes", "Beach Culture", "Carnival Experience"]
    },
    {
      destination: "Cape Town",
      type: "Cultural",
      features: [0.7, 0.9, 0.8, 0.9],
      highlights: ["Table Mountain", "Robben Island", "V&A Waterfront"],
      bestSeasons: ["October-April"],
      avgCost: 2000,
      idealDuration: "7-10 days",
      localCuisine: ["Cape Malay Curry", "Seafood", "South African Wine"],
      activities: ["Cultural Tours", "Wine Tasting", "Community Projects"]
    }
  ],
  adventure: [
    {
      destination: "New Zealand",
      type: "Adventure",
      features: [0.9, 0.8, 0.6, 0.7],
      highlights: ["Milford Sound", "Queenstown", "Rotorua"],
      bestSeasons: ["Summer", "Spring"],
      avgCost: 3500,
      idealDuration: "10-14 days",
      localCuisine: ["Seafood", "Maori Hangi", "Wine Tours"],
      activities: ["Bungee Jumping", "Hiking", "Whale Watching"]
    },
    {
      destination: "Costa Rica",
      type: "Adventure",
      features: [0.8, 0.9, 0.7, 0.8],
      highlights: ["Arenal Volcano", "Manuel Antonio", "Monteverde"],
      bestSeasons: ["Dry Season", "December-April"],
      avgCost: 2300,
      idealDuration: "7-10 days",
      localCuisine: ["Gallo Pinto", "Fresh Fruits", "Local Coffee"],
      activities: ["Zip-lining", "Rainforest Treks", "Surfing"]
    },
    {
      destination: "Nepal",
      type: "Adventure",
      features: [0.9, 0.8, 0.6, 0.7],
      highlights: ["Mount Everest Base Camp", "Kathmandu Valley", "Pokhara"],
      bestSeasons: ["October-November", "March-April"],
      avgCost: 2000,
      idealDuration: "12-15 days",
      localCuisine: ["Momos", "Dal Bhat", "Nepali Tea"],
      activities: ["Trekking", "Mountain Climbing", "Temple Visits"]
    },
    {
      destination: "Iceland",
      type: "Adventure",
      features: [0.8, 0.9, 0.7, 0.6],
      highlights: ["Northern Lights", "Golden Circle", "Blue Lagoon"],
      bestSeasons: ["Summer", "Winter"],
      avgCost: 3800,
      idealDuration: "7-10 days",
      localCuisine: ["Fresh Seafood", "Icelandic Lamb", "Skyr"],
      activities: ["Glacier Hiking", "Hot Springs", "Whale Watching"]
    },
    {
      destination: "Peru",
      type: "Adventure",
      features: [0.7, 0.9, 0.8, 0.9],
      highlights: ["Machu Picchu", "Sacred Valley", "Cusco"],
      bestSeasons: ["May-October"],
      avgCost: 2800,
      idealDuration: "10-14 days",
      localCuisine: ["Ceviche", "Lomo Saltado", "Pisco Sour"],
      activities: ["Inca Trail Hiking", "Local Communities", "Cultural Workshops"]
    },
    {
      destination: "Tanzania",
      type: "Adventure",
      features: [0.8, 0.9, 0.7, 0.9],
      highlights: ["Serengeti", "Kilimanjaro", "Zanzibar"],
      bestSeasons: ["June-October"],
      avgCost: 4500,
      idealDuration: "12-15 days",
      localCuisine: ["African BBQ", "Spiced Rice", "Local Fruits"],
      activities: ["Safari Tours", "Cultural Villages", "Beach Relaxation"]
    }
  ],
  relaxation: [
    {
      destination: "Maldives",
      type: "Relaxation",
      features: [0.7, 0.9, 0.8, 0.9],
      highlights: ["Overwater Bungalows", "Coral Reefs", "Private Beaches"],
      bestSeasons: ["November-April"],
      avgCost: 4000,
      idealDuration: "5-7 days",
      localCuisine: ["Fresh Seafood", "Tropical Fruits", "Maldivian Curry"],
      activities: ["Snorkeling", "Spa Treatments", "Sunset Cruises"]
    },
    {
      destination: "Tuscany",
      type: "Relaxation",
      features: [0.8, 0.7, 0.9, 0.8],
      highlights: ["Vineyard Estates", "Medieval Towns", "Rolling Hills"],
      bestSeasons: ["Spring", "Fall"],
      avgCost: 2800,
      idealDuration: "7-10 days",
      localCuisine: ["Wine Tasting", "Italian Cuisine", "Olive Oil Tours"],
      activities: ["Cooking Classes", "Villa Stays", "Countryside Drives"]
    },
    {
      destination: "Bali",
      type: "Relaxation",
      features: [0.7, 0.8, 0.9, 0.8],
      highlights: ["Ubud Rice Terraces", "Uluwatu Temple", "Nusa Dua Beaches"],
      bestSeasons: ["April-October"],
      avgCost: 2200,
      idealDuration: "8-10 days",
      localCuisine: ["Nasi Goreng", "Fresh Seafood", "Tropical Fruits"],
      activities: ["Yoga Retreats", "Temple Tours", "Beach Relaxation"]
    },
    {
      destination: "Santorini",
      type: "Relaxation",
      features: [0.8, 0.7, 0.9, 0.9],
      highlights: ["Oia Sunset", "Caldera Views", "Black Sand Beaches"],
      bestSeasons: ["Late Spring", "Early Fall"],
      avgCost: 3500,
      idealDuration: "5-7 days",
      localCuisine: ["Greek Mezedes", "Fresh Fish", "Local Wine"],
      activities: ["Sunset Watching", "Wine Tasting", "Boat Tours"]
    },
    {
      destination: "Greek Islands",
      type: "Relaxation",
      features: [0.7, 0.8, 0.9, 1.0],
      highlights: ["Santorini Sunset", "Mykonos Beaches", "Ancient Ruins"],
      bestSeasons: ["May-September"],
      avgCost: 3000,
      idealDuration: "10-14 days",
      localCuisine: ["Fresh Seafood", "Greek Mezedes", "Local Wine"],
      activities: ["Island Hopping", "Cultural Tours", "Beach Yoga"]
    },
    {
      destination: "Amalfi Coast",
      type: "Relaxation",
      features: [0.8, 0.7, 0.9, 0.9],
      highlights: ["Positano", "Ravello Gardens", "Capri Island"],
      bestSeasons: ["May-September"],
      avgCost: 3500,
      idealDuration: "7-10 days",
      localCuisine: ["Italian Seafood", "Limoncello", "Local Pasta"],
      activities: ["Cooking Classes", "Boat Tours", "Village Walks"]
    }
  ]
};

const personalizedTrips = {
  cultural: [
    {
      destination: "Barcelona",
      type: "Cultural",
      personalityMatch: {
        ENFJ: "Perfect for your natural ability to connect with diverse groups and create meaningful cultural experiences",
        // Other personality matches...
      },
      localExperiences: [
        "Community festivals",
        "Local cooking workshops",
        "Cultural exchange events"
      ],
      travelTips: [
        "Join group activities to meet locals",
        "Participate in community events",
        "Take time to mentor fellow travelers"
      ]
    }
  ],
  adventure: [
    {
      destination: "Peru",
      type: "Adventure",
      personalityMatch: {
        ENFJ: "Ideal for your leadership skills and desire to create meaningful connections with local communities",
        // Other personality matches...
      },
      localExperiences: [
        "Community homestays",
        "Traditional ceremonies",
        "Group hiking experiences"
      ],
      travelTips: [
        "Organize group activities",
        "Connect with local guides",
        "Share cultural experiences"
      ]
    }
  ]
};

const AITravelFeatures = ({ userMBTI }) => {
  const [travelBuddies, setTravelBuddies] = useState([]);
  const [optimalRoute, setOptimalRoute] = useState([]);
  const [adventureScore, setAdventureScore] = useState(0);
  const [randomTrip, setRandomTrip] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [travelStats, setTravelStats] = useState({
    monthlyVisits: [],
    destinationTypes: [],
    satisfactionScores: []
  });

  // Find compatible travel buddies
  const findTravelBuddies = () => {
    const buddies = Object.entries(mbtiCompatibility[userMBTI] || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([mbti, score]) => ({ mbti, score }));
    setTravelBuddies(buddies);
  };

  // Optimize travel route using adjacency matrix
  const optimizeRoute = (destinations) => {
    // Simple implementation of nearest neighbor algorithm
    const route = [destinations[0]];
    const unvisited = destinations.slice(1);
    
    while (unvisited.length > 0) {
      const current = route[route.length - 1];
      const nearest = unvisited.reduce((nearest, dest) => {
        const distance = calculateDistance(current, dest);
        return distance < calculateDistance(current, nearest) ? dest : nearest;
      });
      
      route.push(nearest);
      unvisited.splice(unvisited.indexOf(nearest), 1);
    }
    
    setOptimalRoute(route);
  };

  // Calculate MBTI Adventure Score
  const calculateAdventureScore = (tripFeatures) => {
    const mbtiVector = mbtiVectors[userMBTI];
    const score = tripFeatures.reduce((acc, feature, i) => 
      acc + feature * mbtiVector[i % mbtiVector.length], 0);
    setAdventureScore(score);
  };

  // Generate random trip based on MBTI
  const generateRandomTrip = () => {
    const allTrips = [
      ...tripDatabase.cultural,
      ...tripDatabase.adventure,
      ...tripDatabase.relaxation
    ];
    
    const destinations = getDestinationMatch(userMBTI);
    
    // Filter trips based on MBTI compatibility
    const compatibleTrips = allTrips.filter(trip => {
      return destinations.some(dest => 
        trip.destination.toLowerCase().includes(dest.toLowerCase())
      );
    });
    
    // Ensure we don't repeat the last destination
    const availableTrips = compatibleTrips.filter(trip => 
      !randomTrip || trip.destination !== randomTrip.destination
    );
    
    // If no other options, use all compatible trips
    const tripsToChooseFrom = availableTrips.length > 0 ? availableTrips : compatibleTrips;
    
    const randomIndex = Math.floor(Math.random() * tripsToChooseFrom.length);
    const selectedTrip = tripsToChooseFrom[randomIndex];
    
    const enhancedTrip = {
      ...selectedTrip,
      mbtiRecommendation: {
        personalityType: userMBTI,
        description: getMBTIDescription(userMBTI),
        travelStyle: getTravelStyle(userMBTI),
        personalizedTips: `Perfect destination for ${userMBTI} travelers who love ${selectedTrip.type.toLowerCase()} experiences`
      }
    };
    
    setRandomTrip(null);
    setTimeout(() => {
      setRandomTrip(enhancedTrip);
    }, 100);
  };

  // Generate personality travel heatmap
  const generatePersonalityHeatmap = () => {
    const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
                       'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
    
    const travelPreferences = ['Cultural', 'Adventure', 'Relaxation', 'Social'];
    
    const heatmapData = travelPreferences.map(preference => {
      const row = {
        preference: preference
      };
      
      mbtiTypes.forEach(type => {
        const compatibility = calculateCosineSimilarity(userMBTI, type);
        row[type] = compatibility;
      });
      
      return row;
    });
    
    setHeatmapData(heatmapData);
  };

  useEffect(() => {
    if (userMBTI) {
      findTravelBuddies();
      generateRandomTrip();
      generatePersonalityHeatmap();
      generateTravelStats();
    }
  }, [userMBTI]);

  const generateTravelStats = () => {
    // Generate monthly visit data
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      visits: Math.floor(Math.random() * 1000) + 500,
      bookings: Math.floor(Math.random() * 800) + 300
    }));

    // Generate destination type data
    const typeData = Object.keys(destinationStats).map(type => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      visits: Object.values(destinationStats[type])
        .reduce((sum, stat) => sum + stat.visits, 0),
      averageRating: (Object.values(destinationStats[type])
        .reduce((sum, stat) => sum + stat.rating, 0) / 
        Object.keys(destinationStats[type]).length).toFixed(1)
    }));

    setTravelStats({
      monthlyVisits: monthlyData,
      destinationTypes: typeData,
      satisfactionScores: Object.entries(destinationStats)
        .flatMap(([type, destinations]) => 
          Object.entries(destinations).map(([dest, stats]) => ({
            destination: dest.replace('_', ' '),
            rating: stats.rating,
            visits: stats.visits
          })))
    });
  };

  return (
    <div className="container mx-auto px-8 py-20">
      <h2 className="text-3xl font-bold text-blue-600 mb-8">AI Travel Analytics</h2>
      
{/* Travel Buddies Section */}
<div className="bg-white rounded-lg shadow-lg p-6 mb-8">
  <h3 className="text-xl font-semibold mb-4">Your Travel Compatibility Guide</h3>
  <p className="text-gray-600 mb-6">Based on your {userMBTI} personality type: {getMBTIDescription(userMBTI)}</p>
  
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {travelBuddies.map((buddy, index) => (
      <motion.div
        key={index}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold">{buddy.mbti}</h4>
            <p className="text-sm text-gray-600">{getMBTIDescription(buddy.mbti)}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {(buddy.score * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500">Match Rate</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h5 className="font-medium text-sm text-gray-700">Preferred Travel Style</h5>
            <ul className="text-sm text-gray-600">
              {getTravelStyle(buddy.mbti).map((style, i) => (
                <li key={i} className="flex items-center">
                  <span className="mr-2">•</span>{style}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-sm text-gray-700">Recommended Destinations</h5>
            <div className="flex flex-wrap gap-2">
              {getDestinationMatch(buddy.mbti).map((dest, i) => (
                <span key={i} className="px-2 py-1 bg-white rounded-full text-xs text-blue-600">
                  {dest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</div>

      {/* Monthly Travel Trends */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Monthly Travel Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={travelStats.monthlyVisits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="visits" stroke="#8884d8" />
              <Line type="monotone" dataKey="bookings" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Destination Type Analysis */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Destination Type Analysis</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={travelStats.destinationTypes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="visits" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="averageRating" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Random Trip Generator */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Personalized Trip Suggestion</h3>
        {randomTrip && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-2xl font-bold text-blue-800">{randomTrip.destination}</h4>
                <p className="text-md text-gray-600">{randomTrip.type} Experience</p>
                <p className="text-sm text-indigo-600 mt-2">
                  {randomTrip.mbtiRecommendation.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Average Cost</p>
                <p className="text-lg font-semibold text-blue-600">${randomTrip.avgCost}</p>
              </div>
            </div>

            <div className="bg-white/50 p-4 rounded-lg mb-4">
              <h5 className="font-medium text-gray-700 mb-2">Personality Travel Match</h5>
              <p className="text-gray-600">{randomTrip.mbtiRecommendation.personalizedTips}</p>
              <div className="mt-2">
                <h6 className="font-medium text-gray-700">Recommended Travel Style:</h6>
                <ul className="list-disc list-inside text-gray-600">
                  {randomTrip.mbtiRecommendation.travelStyle.map((style, i) => (
                    <li key={i}>{style}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Highlights</h5>
                <ul className="list-disc list-inside text-gray-600">
                  {randomTrip.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Best Time to Visit</h5>
                <p className="text-gray-600">{randomTrip.bestSeasons.join(", ")}</p>
                <h5 className="font-medium text-gray-700 mt-3 mb-2">Ideal Duration</h5>
                <p className="text-gray-600">{randomTrip.idealDuration}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Local Cuisine</h5>
                <ul className="list-disc list-inside text-gray-600">
                  {randomTrip.localCuisine.map((cuisine, i) => (
                    <li key={i}>{cuisine}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Featured Activities</h5>
                <ul className="list-disc list-inside text-gray-600">
                  {randomTrip.activities.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
        <button
          onClick={generateRandomTrip}
          className="mt-6 w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Generate New Trip Suggestion
        </button>
      </div>

      {/* Personality Travel Compatibility Map */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Personality Travel Compatibility Map</h3>
        <p className="text-gray-600 mb-4">
          This map shows how different personality types align with your travel preferences.
          Larger, brighter circles indicate higher compatibility.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.keys(mbtiVectors).map((mbti) => {
            const compatibility = calculateCosineSimilarity(userMBTI, mbti);
            const compatibilityScore = Math.round(compatibility * 100);
            
            return (
              <motion.div
                key={mbti}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-bold text-blue-900">{mbti}</h4>
                  <span className={`text-sm font-semibold ${
                    compatibilityScore >= 50 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Compatibility: {compatibilityScore}%
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {getTravelStyle(mbti)[0]}
                </p>
                
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Top Destinations:</p>
                  <div className="flex flex-wrap gap-1">
                    {getDestinationMatch(mbti).map((dest, i) => (
                      <span 
                        key={i}
                        className="text-xs bg-white px-2 py-1 rounded-full text-blue-600"
                      >
                        {dest}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
          <div className="text-center">
            <div className="font-semibold text-blue-900">Intuitive</div>
            <div className="text-sm text-gray-600">↑</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-900">Sensing</div>
            <div className="text-sm text-gray-600">↓</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-900">Thinking</div>
            <div className="text-sm text-gray-600">←</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-blue-900">Feeling</div>
            <div className="text-sm text-gray-600">→</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">How to Read This Map</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Compatibility score shows how well personalities match for travel</li>
            <li>• Green scores indicate high compatibility with your type ({userMBTI})</li>
            <li>• Each card shows recommended destinations and travel styles</li>
            <li>• Hover over cards to see more details</li>
          </ul>
        </div>
      </div>

      {/* Destination Satisfaction Scores */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4">Destination Satisfaction</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={travelStats.satisfactionScores}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 5]} />
              <YAxis dataKey="destination" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="rating" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AITravelFeatures; 