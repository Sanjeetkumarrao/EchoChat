import { useState } from "react";
import { loginUser } from "../services/auth.service";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await loginUser(formData);

            localStorage.setItem(
                "token",
                res.data.accessToken
            );

            alert("Login Successful");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;