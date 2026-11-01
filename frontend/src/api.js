import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes('/auth/login')) {
      localStorage.clear();
      window.location.assign('/login');
    }
    return Promise.reject(err);
  }
);

export const errMsg = (err) => {
  const data = err.response?.data;
  if (data?.errors?.length) return data.errors.map((e) => e.message).join('. ');
  return data?.message || 'Something went wrong. Try again.';
};

export default api;
