import axios from './axios';

export const getLessons = () => {
    return axios.get('/lessons');
}