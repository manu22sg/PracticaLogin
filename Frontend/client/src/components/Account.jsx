import React from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

const Account = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = jwt_decode(token);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="account">
      <h2>Mi cuenta</h2>
      <p>Nombre: {user.name}</p>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Account;
