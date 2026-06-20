import api from './axios';
 
export const getMe = () => api.get('/profile/me');
 
export const uploadPhoto = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/profile/photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};