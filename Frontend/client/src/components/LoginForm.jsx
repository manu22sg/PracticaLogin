import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.services";
import { jwtDecode } from "jwt-decode"; // Importa jwt-decode correctamente
import { AuthContext } from "../context/Contexto"; // Importa el contexto
import Swal from "sweetalert2";
import Cookies from "cookie-universal"; // Importa cookie-universal

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext); // Usa el contexto

  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // Redirige al dashboard si el usuario ya está autenticado
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Agrega la función handleSubmit
    try {
      const { accessToken, refreshToken } = await loginUser({
        email,
        password,
      });

      console.log("AccessToken recibido:", accessToken); // Verifica la recepción del accessToken
      console.log("RefreshToken recibido:", refreshToken); // Verifica la recepción del refreshToken

      login(accessToken, refreshToken); // Usa la función login del contexto para actualizar el estado del usuario
      const decoded = jwtDecode(accessToken);
      const userRole = decoded.role;

      // Redirigir al dashboard si el rol es Administrador Interno
      if (
        userRole === "Administrador Interno" ||
        userRole === "Personal Contable"
      ) {
        navigate("/dashboard");
      } else {
        // Redirigir a una página diferente si el rol no es Administrador Interno
        navigate("/algunaotrapagina");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Credenciales incorrectas",
      });
    }
  };

  return (
    <div className="p-4 bg-white text-black rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
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
        <div className="mb-4">
          <label className="block mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-200 text-black"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <p>¿No tienes una cuenta?</p>
        <button
          onClick={() => navigate("/register")}
          className="mt-2 p-2 bg-green-500 hover:bg-green-600 rounded text-white"
        >
          Regístrate
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
