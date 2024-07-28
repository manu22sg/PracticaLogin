import axios from "./api";
export const excelCompanies = async () => {
  return await axios.get("/excelCompanies", {
    responseType: "blob", // Asegúrate de que la respuesta es tratada como un blob
  });
};
