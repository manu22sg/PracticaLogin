import api from "./api";
export const loginUser = async function loginUser(credentials) {
  try {
    const response = await api.post("/auth/login", credentials);
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    
    
    return { accessToken }; // Almacena el refreshToken en una cookie
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return { error: error.response.data.message };
  }
};

export const registerUser = async (data) =>
  await api.post("/auth/register", data);
export const logout = async () => await api.post("/auth/logout");


