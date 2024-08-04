import api from "./api";
export const getCompanies = async () => await api.get("/companies");

export const createCompany = async (data) => {
  try {
    const response = await api.post("/companies", data);
    return response;
  } catch (error) {
    console.error("Error creating company:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateCompany = async (rut, data) =>
  await api.patch(`/companies/${rut}`, data);
  

export const deleteCompany = async (rut) =>
  await api.delete(`/companies/${rut}`);

export const listGiros = async () => await api.get("/giros");
