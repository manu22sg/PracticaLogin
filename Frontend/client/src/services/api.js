import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token"); // Limpia el token expirado
      window.location.href = "/login"; // Redirige al login
    }
    return Promise.reject(error);
  }
);

export const getCompanies = () => api.get("/companies");
export const createCompany = (data) => api.post("/companies", data);
export const updateCompany = (email, data) =>
  api.patch(`/companies/${email}`, data);
export const deleteCompany = (email) => api.delete(`/companies/${email}`);

// Puedes añadir más funciones para otras entidades como usuarios
export const getUsers = () => api.get("/users");
export const createUser = (data) => api.post("/users", data);
export const updateUser = (rut, data) => api.patch(`/users/${rut}`, data);
export const deleteUser = (rut) => api.delete(`/users/${rut}`);
//login y register
export const loginUser = (credentials) => api.post("/auth/login", credentials);
export const registerUser = (data) => api.post("/auth/register", data);
export const logout = () => api.post("/auth/logout");
