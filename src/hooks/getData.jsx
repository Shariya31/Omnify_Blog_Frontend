import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';

const useFetch = (url, options = {}, dependencies=[]) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Memoize the options object to prevent unnecessary changes
    const memoizedOptions = useMemo(() => options, [
        options.token,
        JSON.stringify(options.headers),
        JSON.stringify(options.filters),
        JSON.stringify(options.sorting),
        options.body,
        options.method,
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios({
                    url,
                    method: memoizedOptions.method || 'GET',
                    headers: {
                        Authorization: memoizedOptions.token ? `Bearer ${memoizedOptions.token}` : '',
                        ...memoizedOptions.headers,
                    },
                    params: {
                        ...memoizedOptions.filters,
                        ...memoizedOptions.sorting,
                    },
                    data: memoizedOptions.body,
                });
                setData(response.data);
            } catch (error) {
                setError(error.response.data.message);
                console.log(error)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, memoizedOptions, ...dependencies]); 

    return { data, loading, error };
};

export default useFetch;