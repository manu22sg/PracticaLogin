import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/Contexto"; // Importa el contexto

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext); // Usa el contexto

  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // Redirige al dashboard si el usuario ya está autenticado
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.token;
      console.log("Token received:", token); // Verifica que el token se reciba correctamente
      login(token); // Usa la función login del contexto

      // Decodificar el token para verificar el rol del usuario
      const decoded = jwtDecode(token);
      const userRole = decoded.role;

      // Redirigir al dashboard si el rol es Administrador Interno
      if (userRole === "Administrador Interno") {
        navigate("/dashboard");
      } else {
        // Redirigir a una página diferente si el rol no es Administrador Interno
        navigate("/some-other-page");
      }
    } catch (error) {
      setError("Credenciales inválidas. Inténtalo de nuevo.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
