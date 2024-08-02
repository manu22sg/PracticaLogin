// ResetPasswordPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { resetPassword } from "../services/user.services";

const ResetPasswordPage = () => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromQuery = queryParams.get("token");
    if (tokenFromQuery) {
      setToken(tokenFromQuery);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Token no proporcionado.",
      });
      navigate("/login");
    }
  }, [location.search, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
      });
    }
    try {
      await resetPassword(token, newPassword); // Asegúrate de que el token y la nueva contraseña se envíen correctamente
      Swal.fire({
        icon: "success",
        title: "Contraseña Restablecida",
        text: "Tu contraseña ha sido actualizada exitosamente. Puedes iniciar sesión con tu nueva contraseña.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo restablecer la contraseña. Verifica el token e intenta nuevamente.",
      });
    }
  };

  return (
    <div className="p-4 bg-white text-black rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Nueva Contraseña:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Confirmar Contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Restablecer Contraseña
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
