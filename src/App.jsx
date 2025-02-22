import './index.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import "jquery-ui/ui/widgets/autocomplete";
import CarRental from './components/Car_Rental/CarRental';
import CarView from './components/Car_Rental/CarView';
import Attracts_main from './components/Attractions/attracts_main';
import GuidePage from './components/Attractions/GuidePage';
import PaymentSuccess from './components/UI/PaymentSuccess';

function App() {

  return (
    <>
      <main>
        <Routes>
          <Route path='/' element={ <Navigate to={'/car_rental'} /> } />
          <Route path='/payment_success' element={ <PaymentSuccess /> } />
          <Route path='/car_rental' element={ <CarRental /> } />
          <Route path='/car_view' element={ <CarView /> }/>
          <Route path='/attractions' element={ <Attracts_main/>}></Route>
          <Route path='/attractions/:countryName' element={ <GuidePage /> }></Route>
        </Routes>
      </main>

    </>
  );
}

export default App;
