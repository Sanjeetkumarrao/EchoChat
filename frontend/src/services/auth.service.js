import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api/auth",
});

export const registerUser = (data) => {
    return API.post("/register", data);
};

export const loginUser = (data) => {
    return API.post("/login", data);
};

export const verifyEmail = (token) => {
    return API.get(`/verify?token=${token}`);
};