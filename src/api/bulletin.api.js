import api from "./axios";

export const genererBulletin = (etudiantId, anneeId) =>
  api.post(
    `/admin/bulletins/generer?etudiantId=${etudiantId}&anneeId=${anneeId}`,
  );
export const validerBulletin = (id) =>
  api.put(`/admin/bulletins/${id}/valider`);
export const invaliderBulletin = (id) =>
  api.put(`/admin/bulletins/${id}/invalider`);
export const getBulletinAdmin = (anneeId) =>
  api.get(`/admin/bulletins?anneeId=${anneeId}`);
export const consulterBulletin = (etudiantId, anneeId) =>
  api.get(`/etudiant/bulletins?etudiantId=${etudiantId}&anneeId=${anneeId}`);
export const getHistoriqueBulletins = (etudiantId) =>
  api.get(`/etudiant/bulletins/historique?etudiantId=${etudiantId}`);
