import './index.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import "jquery-ui/ui/widgets/autocomplete";
import CarRental from './components/Car_Rental/CarRental';
import CarView from './components/Car_Rental/CarView';
import Attracts_main from './components/Attractions/attracts_main';
import GuidePage from './components/Attractions/GuidePage';
import PaymentSuccess from './components/UI/PaymentSuccess';
import Hotel from './components/Hotel_Flight/hotel';
import UserDashboard from './components/Dashboard/UserDashboard';
import Flight from './components/Hotel_Flight/flight';
import Cruise from './components/Cruise/Cruise';
import CruiseBooking from './components/Cruise/CruiseBooking';
import MyBooking from './components/Dashboard/MyBooking';
import LoginForm from './components/Registration/LoginForm';
import RegisterForm from './components/Registration/RegisterForm';
import SettingsPage from './components/Chat/SettingsPage';
import ProfilePage from './components/Chat/ProfilePage';
import HomePage from './components/Chat/HomePage';
import SignUpPage from './components/Chat/SignUpPage';
import LoginPage from './components/Chat/LoginPage';
import { useAuthStore } from './components/Chat/store/useAuthStore';
import { useThemeStore } from './components/Chat/store/useThemeStore';

function App() {

  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  return (
    <>
      <main>
        <Routes>
          {/* Hmz Route */}
          <Route path='/' element={ <LoginForm /> } />
          <Route path='/payment_success' element={ <PaymentSuccess /> } />
          <Route path='/car_rental' element={ <CarRental /> } />
          <Route path='/car_view' element={ <CarView /> }/>
          <Route path='/attractions' element={ <Attracts_main/>}></Route>
          <Route path='/attractions/:countryName' element={ <GuidePage /> }></Route>

          {/* Hpl Route */}
          <Route path='/dashboard' element={< UserDashboard />} />
          <Route path='/hotel' element={ <Hotel /> }></Route>
          <Route path='/flight' element={ <Flight />}> </Route>
          <Route path="/log_in" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Akm Route */}
          <Route path='/cruises' element={ <Cruise />}></Route>
          <Route path='/cruises/:CruiseId' element={ <CruiseBooking /> }></Route>
          <Route path='/myBookings' element={ <MyBooking />} ></Route>

          {/* Kkh Route */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/chat" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/chat" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/chat" />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>
      </main>

    </>
  );
}

export default App;
