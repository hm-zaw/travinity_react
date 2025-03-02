import axios from "axios";

const API_URL = "http://localhost:8080";

export async function fetchUser(user_id) {
    try {
        const response = await axios.get(`${API_URL}/user`, {
            params: { user_id } 
        });
        return response.data; 
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null; 
    }
}

export async function getBookingAll(){
    const service_url = `${API_URL}/myBookings`;
    return await axios.get(service_url);
}

export async function getDetailsOfCars(carDetail){
    const service_url = `${API_URL}/city`;
    return await axios.get(service_url , { params: carDetail });
}


export async function getCar({ id, key }) {
    const service_url = `${API_URL}/car`;
    return await axios.get(service_url, {
        params: { id, key },
    });
}

export async function checkPayment({ paymentInfo }){
    const service_url = `${API_URL}/payment`; 
    return await axios.post(service_url, paymentInfo);
}

export async function checkPaymentHotel({ paymentInfo }){
    const service_url = `${API_URL}/payment_hotel`; 
    return await axios.post(service_url, paymentInfo);
}

export async function checkPaymentCruise({ paymentInfo }){
    const service_url = `${API_URL}/payment_cruise`; 
    return await axios.post(service_url, paymentInfo);
}


export async function getAttractions({ city }){
    const service_url = `${API_URL}/city`;
    return await axios.get(service_url, { params: city });
}