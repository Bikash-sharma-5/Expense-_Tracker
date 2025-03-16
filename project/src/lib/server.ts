// src/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',  // Change the URL if needed
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
