import { data } from 'react-router-dom';
import api from './axios';

export const login = (data) => api.post('/auth/login', data);