import api from "./axios";

export const getNotesByEtudiant = (etudiantId) =>
  api.get(`/admin/notes/etudiant/${etudiantId}`);
export const getNotesByExamen = (examenId) =>
  api.get(`/admin/notes/examen/${examenId}`);
export const saisirNote = (data) => api.post("/admin/notes", data);
export const supprimerNote = (id) => api.delete(`/admin/notes/${id}`);
