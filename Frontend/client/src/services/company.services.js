import api from "./api";
export const getCompanies = async () => await api.get("/companies");

export const createCompany = async (data) =>
  await api.post("/companies", data);
export const updateCompany = async (rut, data) =>
  await api.patch(`/companies/${rut}`, data);

export const deleteCompany = async (rut) =>
  await api.delete(`/companies/${rut}`);

export const listGiros = async () => await api.get("/giros");
