import api from "./axios";

export const getMatieres = (params) => api.get("/admin/matieres", { params });
export const creerMatiere = (data) => api.post("/admin/matieres", data);
export const modifierMatiere = (id, data) =>
  api.put(`/admin/matieres/${id}`, data);
export const supprimerMatiere = (id) => api.delete(`/admin/matieres/${id}`);
export const getMatieresEtudiant = (params) => api.get('/matieres', { params });
