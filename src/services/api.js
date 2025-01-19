import axios from 'axios';
import { DATABASE_URL } from '../config/config';
const API_URL = `${DATABASE_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'accept': '*/*',
        'Content-Type': 'application/json'
    },
    timeout: 5000,
});

export default api; 