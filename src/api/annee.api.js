import api from './axios';

// Routes ADMIN uniquement
export const getAnneesAdmin = () => api.get('/admin/annees');
export const creerAnnee     = (data)    => api.post('/admin/annees', data);
export const modifierAnnee  = (id, data)=> api.put(`/admin/annees/${id}`, data);
export const supprimerAnnee = (id)      => api.delete(`/admin/annees/${id}`);

// Route accessible par ADMIN et ETUDIANT
export const getAnnees = () => api.get('/annees');
