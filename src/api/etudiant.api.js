import { data, useParams } from "react-router-dom";
import api from "./axios";

export const getEtudiants = (params) => api.get("/admin/etudiants", { params });
export const getEtudiant = (id) => api.get(`/admin/etudiants/${id}`);
export const creerEtudiant = (data) => api.post("/admin/etudiants", data);
export const modifierEtudiant = (id, data) =>
  api.put(`/admin/etudiants/${id}`, data);
export const supprimerEtudiant = (id) =>
  api.delete(`/admin/etudiants/${id}`, data);
export const getMonProfil = () => api.get("/etudiant/profil");
