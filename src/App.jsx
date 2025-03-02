import './index.css';
import { Navigate, Route, Routes } from 'react-router-dom';
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
import AdminDashboard from './components/Chat/AdminDashboard';

function App() {

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
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Akm Route */}
          <Route path='/cruises' element={ <Cruise />}></Route>
          <Route path='/cruises/:CruiseId' element={ <CruiseBooking /> }></Route>
          <Route path='/myBookings' element={ <MyBooking />} ></Route>

          {/* Kkh Route */}
          <Route path="/admin" element={<AdminDashboard />} />

        </Routes>
      </main>

    </>
  );
}

export default App;
