import api from "./axios";

export const getFilieres = () => api.get("/admin/filieres");
export const getFiliere = (id) => api.get(`/admin/filieres/${id}`);
export const creerFiliere = (data) => api.post("/admin/filieres", data);
export const modifierFiliere = (id, data) =>
  api.put(`/admin/filieres/${id}`, data);
export const supprimerFiliere = (id) => api.delete(`/admin/filieres/${id}`);
