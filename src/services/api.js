import axios from "axios";

const api = axios.create({
  baseURL: "https://semana-omnistackbackend.herokuapp.com"
});

export default api;
