import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userExist, userNotExist } from "../slices/userReducer.js";
import { server } from "../store/store.js";

const schema = yup.object().shape({
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(16, "Password cannot exceed 16 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
        .required("Password is required"),
});


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.post(`${server}/api/auth/login`, data);
            setSuccess("Login successful!");
            console.log(response)
            dispatch(userExist(response.data))
            localStorage.setItem("userData", JSON.stringify(response.data))
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
        reset();
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-[2rem] max-w-full h-screen mx-auto bg-white shadow-md rounded-lg">
            <div className="w-[70%] sm:w-[40%] lg:w-[40%] mx-auto p-4 bg-white shadow-md rounded-lg">
                <div className="flex flex-col gap-4 w-full">
                    <div>
                        <h2>Admin</h2>
                        <p>Email: abushariya31@gmail.com</p>
                        <p>Password: Admin@pass123</p>
                    </div>
                </div>
                <h2 className="text-xl font-bold mb-4">Login</h2>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full p-2 border rounded"
                        />
                        <p className="text-red-500 text-sm">{errors.email?.message}</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password")}
                                className="w-full p-2 border rounded pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <p className="text-red-500 text-sm">{errors.password?.message}</p>
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-200"
                        disabled={loading}
                    >
                        {loading ? "Loging in..." : "Login"}
                    </button>
                    <p className="cursor-pointer hover:text-red-700" onClick={() => navigate('/forgot-password')}>Forgot password ? Click here</p>
                </form>
            </div>

        </div>
    );
};

export default Login;
