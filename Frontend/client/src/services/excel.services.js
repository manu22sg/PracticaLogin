import api from "./api";
export const excelCompanies = async () => {
  return await api.get("/excelCompanies", {
    responseType: "blob", // Asegúrate de que la respuesta es tratada como un blob
  });
};
