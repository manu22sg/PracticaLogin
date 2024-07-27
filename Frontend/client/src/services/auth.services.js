import axios from "./api";
import Cookies from "cookie-universal";
const cookies = Cookies();
export const loginUser = async function loginUser(credentials) {
  try {
    const response = await axios.post("/auth/login", credentials);
    const { accessToken, refreshToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict", // Para prevenir ataques CSRF
    }); // Almacena el refreshToken en una cookie
    console.log({ refreshToken });
    return { accessToken, refreshToken }; // Almacena el refreshToken en una cookie
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return { error: error.response.data.message };
  }
};

export const registerUser = async (data) =>
  await axios.post("/auth/register", data);
export const logout = async () => await axios.post("/auth/logout");
