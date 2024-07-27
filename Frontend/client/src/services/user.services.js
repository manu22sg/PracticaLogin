import axios from "./api";

export const getUsers = async () => await axios.get("/users");
export const createUser = async (data) => await axios.post("/users", data);
export const updateUser = async (rut, data) =>
  await axios.patch(`/users/${rut}`, data);
export const deleteUser = async (rut) => await axios.delete(`/users/${rut}`);
