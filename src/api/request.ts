import axios from 'axios';
import NProgress from 'nprogress';
import { api } from '../common/constants';
// import 'nprogress/nprogress.css';
import '../styles/nprogress-custom.css';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let activeRequests = 0;

instance.interceptors.request.use(
  (config) => {
    activeRequests++;
    if (activeRequests === 1) {
      NProgress.start();
    }
    if (!config.url?.includes('login') && !config.url?.includes('register')) {
      const token = localStorage.getItem('token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests === 0) {
      NProgress.done();
    }
    return response;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

export default instance;
