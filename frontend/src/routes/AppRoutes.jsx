import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import VerifyEmail from "../pages/VerifyEmail";
import Home from "../pages/Home";

function AppRoutes() {
    return (
        <Routes>

            <Route
                path="/"
                element={<Home/>}
            />

            <Route
                path="/signup"
                element={<Signup />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/verify-email"
                element={<VerifyEmail />}
            />

        </Routes>
    );
}

export default AppRoutes;