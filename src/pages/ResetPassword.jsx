import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../store/store";

const schema = yup.object().shape({
   password: yup
          .string()
          .min(8, "Password must be at least 8 characters")
          .max(16, "Password cannot exceed 16 characters")
          .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
          .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
          .required("Password is required"),
});

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();
    
    const {token} = useParams()
    console.log(token)
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
            const response = await axios.put(`${server}/api/auth/reset-password/${token}`, data);
            setSuccess("Password reset successfully!");
            console.log(response)
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
        reset();
        navigate('/login')
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-[2rem] max-w-full h-screen mx-auto bg-white shadow-md rounded-lg">
            <div className="w-[70%] sm:w-[40%] lg:w-[40%] mx-auto p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                        <label className="block text-sm font-medium">Password</label>
                        <div className="relative">
                            <input
                                type="text"
                                {...register("password")}
                                className="w-full p-2 border rounded pr-10"
                            />
                            {/* <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button> */}
                        </div>
                        <p className="text-red-500 text-sm">{errors.password?.message}</p>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-200"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword