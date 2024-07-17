import { jwtDecode } from "jwt-decode";

const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  // Verifica que el token esté en el localStorage
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token"); // Limpia el token expirado
      window.location.href = "/login"; // Redirige al login
      return null;
    }

    // Verifica que el token se decodifique correctamente
    return {
      name: decoded.name || "", // Asegúrate de que sea una cadena vacía si no hay nombre
      email: decoded.email || "", // Asegúrate de que sea una cadena vacía si no hay email
      role: decoded.role,
      rut: decoded.rut,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default getUserFromToken;
