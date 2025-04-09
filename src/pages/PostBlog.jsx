import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { server } from "../store/store.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
    title: yup
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(60, "Name cannot exceed 60 characters")
        .required("Name is required"),
    content: yup
        .string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
   
});

const PostBlog = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const { token } = useSelector(state => state.user);

    const navigate = useNavigate();

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
            const response = await axios.post(`${server}/api/blog/create`, data,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccess("Registration successful!");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
        reset();
        navigate('/')
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-[2rem] max-w-full h-screen mx-auto bg-white shadow-md rounded-lg">
            <div className="w-[70%] sm:w-[40%] lg:w-[40%] mx-auto p-4 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-bold mb-4">Post Your Blog</h2>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            {...register("title")}
                            className="w-full p-2 border rounded"
                        />
                        <p className="text-red-500 text-sm">{errors.title?.message}</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium">Content</label>
                        <textarea cols={12} rows={12}
                            type="text"
                            {...register("content")}
                            className="w-full p-2 border rounded"
                        />
                        <p className="text-red-500 text-sm">{errors.content?.message}</p>
                    </div>

                    <button
                        type="submit"
                        className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-200 w-full font-bold"
                        disabled={loading}
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </form>
            </div>

        </div>
    );
};

export default PostBlog;
