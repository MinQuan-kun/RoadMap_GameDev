import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.BackEnd_URL || "http://localhost:5000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;