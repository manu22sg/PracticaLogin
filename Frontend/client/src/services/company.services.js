import axios from "./api";
export const getCompanies = async () => await axios.get("/companies");

export const createCompany = async (data) =>
  await axios.post("/companies", data);
export const updateCompany = async (rut, data) =>
  await axios.patch(`/companies/${rut}`, data);

export const deleteCompany = async (rut) =>
  await axios.delete(`/companies/${rut}`);

export const listGiros = async () => await axios.get("/giros");
