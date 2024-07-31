import api from "./api";

export const getUsers = async () => await api.get("/users");
export const createUser = async (data) => await api.post("/users", data);
export const updateUser = async (rut, data) =>
  await api.patch(`/users/${rut}`, data);
export const deleteUser = async (rut) => await api.delete(`/users/${rut}`);
