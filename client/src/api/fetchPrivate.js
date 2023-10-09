import apiUrl from "../config";

const fetchPrivate = async (endpoint, options = {}) => {
    const url = `${apiUrl}${endpoint}`;
    const defaultHeaders = {
        'Content-Type': 'application/json'
    };

    options.headers = {
        ...defaultHeaders,
        ...options.headers
    };

    options.credentials = 'include';

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
};

export default fetchPrivate;