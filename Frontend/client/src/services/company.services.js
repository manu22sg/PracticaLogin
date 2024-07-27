import axios from "./api";
export const getCompanies = async () => await axios.get("/companies");

export const createCompany = async (data) =>
  await axios.post("/companies", data);
export const updateCompany = async (email, data) =>
  await axios.patch(`/companies/${email}`, data);
export const deleteCompany = async (email) =>
  await axios.delete(`/companies/${email}`);
export const listGiros = async () => await axios.get("/giros");
