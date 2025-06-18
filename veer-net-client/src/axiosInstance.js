import axios from "axios";

const instance = axios.create({

  baseURL: import.meta.env.VITE_API_BASE_URL,
  // withCredentials: true, // keep if you ever need to send cookies
});

export default instance;