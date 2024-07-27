import { jwtDecode } from "jwt-decode";

const getUserFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      return null;
    }

    // Verifica que el token se decodifique correctamente
    return {
      name: decoded.name,
      apellido_paterno: decoded.apellido_paterno,
      apellido_materno: decoded.apellido_materno,
      celular: decoded.celular,
      fecha_nacimiento: decoded.fecha_nacimiento,
      email_opcional: decoded.email_opcional,
      email: decoded.email,
      role: decoded.role,
      rut: decoded.rut,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default getUserFromToken;
