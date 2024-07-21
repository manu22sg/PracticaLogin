import React, { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import CreateCompanyForm from "./components/CreateCompanyForm";
import ViewCompanies from "./components/ViewCompanies";
import { AuthProvider, AuthContext } from "./context/Contexto";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import AdminDashboard from "./components/AdminDashboard";
import Account from "./components/Account";
import PrivateRoute from "./components/PrivateRoute";
import UserList from "./components/userList"; // Vista combinada de usuarios
import CreateUserForm from "./components/CreateUserForm";
//import ViewUsers from "./components/ViewUsers"; // Puede eliminarse si está integrada en UserList
import Navbar from "./components/navBar";
import Sidebar from "./components/SideBar"; // Importa tu Sidebar
import CompanyList from "./components/CompanyList";
import "./App.css";

const AppContent = () => {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);
  const [isSidebarVisible, setSidebarVisible] = useState(
    JSON.parse(localStorage.getItem("isSidebarVisible")) ?? true
  );
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    localStorage.setItem("isSidebarVisible", JSON.stringify(isSidebarVisible));
  }, [isSidebarVisible]);

  if (loading) {
    return <div className="text-white">Cargando...</div>; // Mostrar un mensaje de carga mientras se verifica la autenticación
  }

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="bg-white text-black flex">
      {!isLoginPage && isSidebarVisible && <Sidebar />}
      <div
        className={`flex-grow flex flex-col ${
          isSidebarVisible ? "ml-48" : "ml-0"
        } mt-16`}
      >
        {!isLoginPage && (
          <Navbar
            toggleSidebar={toggleSidebar}
            isSidebarVisible={isSidebarVisible}
          />
        )}
        <div className="container mx-auto py-4">
          <Routes>
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute roles={["Administrador Interno"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/account"
              element={
                <PrivateRoute
                  roles={[
                    "Administrador Interno",
                    "Gerente",
                    "Personal Contable",
                    "Persona Administrativa",
                    "Administrador Externo",
                  ]}
                >
                  <Account />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-user"
              element={
                <PrivateRoute roles={["Administrador Interno"]}>
                  <CreateUserForm />
                </PrivateRoute>
              }
            />

            <Route
              path="/view-users"
              element={
                <PrivateRoute roles={["Administrador Interno"]}>
                  <UserList />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-company"
              element={
                <PrivateRoute roles={["Administrador Interno"]}>
                  <CreateCompanyForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-company"
              element={
                <PrivateRoute roles={["Administrador Interno"]}>
                  <CompanyList />
                </PrivateRoute>
              }
            />
            <Route
              path="/view-companies"
              element={
                <PrivateRoute roles={["Administrador Interno"]}>
                  <ViewCompanies />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
