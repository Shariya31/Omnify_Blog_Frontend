import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import getData from '../hooks/getData';
import { server } from '../store/store';
import { useNavigate } from 'react-router-dom';

const MyBlogs = () => {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [submittedSearchText, setSubmittedSearchText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const { token } = useSelector(state => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 15000);

    return () => clearTimeout(debounceTimer);
  }, [searchText]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSubmittedSearchText(searchText);
    setPage(1);
  };

  const { data, loading, error } = getData(
    `${server}/api/blog/my-blogs?search=${submittedSearchText || debouncedSearchText}&page=${page}`,
    {
      method: 'GET',
      token,
    },
    [refreshKey, page, submittedSearchText, debouncedSearchText]
  );

  const handleDelete = async (blogId) => {
    try {
      const res = await fetch(`${server}/api/blog/${blogId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Delete failed');

      setRefreshKey(prev => prev + 1); 
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <h2 className="text-center">Loading...</h2>;
  if (error) return <h2 className="text-center text-red-500">{error.message}</h2>;

  return (
    <div className='min-h-screen relative flex gap-8'>
      <div className='w-full h-full flex flex-col justify-start pt-4 flex-3'>

        {/* Search */}
        <div className='flex justify-center p-4'>
          <form onSubmit={handleSearchSubmit} className='flex gap-2'>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder='Search'
              className='border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
            />
            <button
              type='submit'
              className='px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-200'
            >
              Search
            </button>
          </form>
        </div>

        {/* Blog Cards */}
        <div className='w-full flex flex-wrap justify-center gap-8 px-4 pb-8 overflow-auto'>
          {data?.blogs?.map((blog, index) => (
            <div
              key={index}
              className='w-full md:w-[20rem] lg:w-[23rem] h-auto p-6 shadow-lg bg-white cursor-pointer rounded-lg overflow-hidden flex flex-col justify-around'
            >
              <h2 className='text-xl text-center font-bold mb-2'>{blog.title.slice(0, 30)}...</h2>
              <p className='text-sm text-gray-700 font-bold'>{blog.content.slice(0, 150)}...</p>

              <div className='flex justify-between mt-5'>
                <button
                  onClick={() => navigate(`/blog/${blog._id}`)}
                  className='px-3 py-1 border rounded-md hover:bg-gray-100 duration-200'
                >
                  Read More
                </button>

                <button
                  onClick={() => navigate(`/edit-blog/${blog._id}`)}
                  className='px-3 py-1 border rounded-md text-blue-600 hover:bg-blue-100 duration-200'
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(blog._id)}
                  className='px-3 py-1 border rounded-md text-red-600 hover:bg-red-100 duration-200'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className='flex justify-center items-center gap-4 pb-8'>
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
            className='px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-200'
          >
            Prev
          </button>

          <span className='text-gray-700'>
            Page {data?.currentPage} of {data?.totalPages}
          </span>

          <button
            disabled={data?.currentPage === data?.totalPages}
            onClick={() => setPage(prev => prev + 1)}
            className='px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-200'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBlogs;
