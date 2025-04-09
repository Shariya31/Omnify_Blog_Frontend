import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { server } from '../store/store';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${server}/api/blog/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch blog');

        setTitle(data.blog.title);
        setContent(data.blog.content);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`${server}/api/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      navigate('/blogs');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <h2 className='text-center'>Loading blog...</h2>;
  if (error) return <h2 className='text-center text-red-500'>{error}</h2>;

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-8'>
      <form
        onSubmit={handleUpdate}
        className='w-full max-w-2xl bg-white shadow-md rounded-lg p-6 flex flex-col gap-4'
      >
        <h1 className='text-2xl font-bold text-center'>Edit Blog</h1>

        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Title'
          required
          className='border px-4 py-2 rounded-md focus:outline-none focus:ring'
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Content'
          rows={10}
          required
          className='border px-4 py-2 rounded-md resize-none focus:outline-none focus:ring'
        />

        <button
          type='submit'
          disabled={updating}
          className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50'
        >
          {updating ? 'Updating...' : 'Update Blog'}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
