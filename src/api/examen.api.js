import api from "./axios";

export const getExamens = (params) => api.get("/admin/examens", { params });
export const creerExamen = (data) => api.post("/admin/examens", data);
export const modifierExamen = (id, data) =>
  api.put(`/admin/examens/${id}`, data);
export const supprimerExamen = (id) => api.delete(`/admin/examens/${id}`);
