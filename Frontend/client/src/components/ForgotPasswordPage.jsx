import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { requestResetPassword } from "../services/user.services";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestResetPassword(email); // Usa requestResetPassword en lugar de axios
      Swal.fire({
        icon: "success",
        title: "Correo enviado",
        text: "Revisa tu correo electrónico para el enlace de restablecimiento. El enlace es válido por 1 hora.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error al enviar el correo de recuperación:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo enviar el correo electrónico. Verifica tu dirección de correo.",
      });
    }
  };

  return (
    <div className="p-4 bg-white text-black rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Enviar Enlace de Recuperación
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
