import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: "4b06ab064acd5723dd8abea7e395447f",
    },
});