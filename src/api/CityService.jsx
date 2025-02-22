import axios from "axios";

const API_URL = "http://localhost:8080";

export async function saveFeedback(values){
    const service_url = `${API_URL}/feedback`;
    return await axios.post(service_url, values);
}

export async function uploadPhotos(formData){
    return await axios.put(`${API_URL}/photo`, formData);
}

export async function getFeedback(id){
    return await axios.get(`${API_URL}/feedback/${id}`);
}