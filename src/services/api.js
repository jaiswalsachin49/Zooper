import axios from 'axios';
const API_KEY = import.meta.env.VITE_API_KEY;

export default axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: API_KEY,
        include_adult: false,
    },
});