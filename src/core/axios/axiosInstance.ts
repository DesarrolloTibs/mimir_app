import axios from 'axios';
import { setupInterceptors } from './interceptors';

const axiosInstance = axios.create({
    // Puedes agregar configuración global aquí
    timeout: 100000,
});

setupInterceptors(axiosInstance);

export default axiosInstance;