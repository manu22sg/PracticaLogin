import api from "./api";

export const getUsers = async () => await api.get("/users");
export const createUser = async (data) => await api.post("/users", data);
export const updateUser = async (rut, data) =>
  await api.patch(`/users/${rut}`, data);
export const deleteUser = async (rut) => await api.delete(`/users/${rut}`);
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/users/reset-password', { token, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Error en la solicitud');
  }
};



export const requestResetPassword = async (email) => {
  try {
    const response = await api.post("/users/request-reset-password", { email });
    return response.data; // Asegúrate de retornar los datos necesarios
  } catch (error) {
    throw error; // Lanza el error para manejarlo en el componente
  }
};

