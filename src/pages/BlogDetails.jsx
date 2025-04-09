import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from '../store/store';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${server}/api/blog/${id}`);
        setBlog(data.blog);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch blog.');
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-full mx-auto p-6 mt-10">
      <button
        className="mb-6 px-4 py-2 border rounded hover:bg-gray-200"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>

        <div className="text-gray-600 text-sm mb-4">
          <span>By: {blog.user.name} ({blog.user.email})</span> <br />
          <span>Posted on: {new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>

        <p className="text-gray-800 leading-relaxed">{blog.content}</p>
      </div>
    </div>
  );
};

export default BlogDetails;
