import axios from 'axios';
const API_KEY = import.meta.env.VITE_API_KEY;
console.log('API_KEY:', API_KEY); // Debugging line to check if API_KEY is loaded correctly

export default axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: API_KEY,
    },
});