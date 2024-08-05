import React, { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router, Route, Routes, useLocation,
} from "react-router-dom";
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import CreateCompanyForm from "./components/CreateCompanyForm";
import { AuthProvider, useAuth } from "./context/Contexto";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import AdminDashboard from "./components/AdminDashboard";
import Account from "./components/Account";
import PrivateRoute from "./components/PrivateRoute";
import UserList from "./components/userList";
import CreateUserForm from "./components/CreateUserForm";
import Navbar from "./components/navBar";
import Sidebar from "./components/SideBar";
import CompanyList from "./components/CompanyList";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AppContent = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isSidebarVisible, setSidebarVisible] = useState(
    JSON.parse(localStorage.getItem("isSidebarVisible")) ?? true
  );
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    localStorage.setItem("isSidebarVisible", JSON.stringify(isSidebarVisible));
  }, [isSidebarVisible]);
  useEffect(() => {
    setSidebarVisible(JSON.parse(localStorage.getItem("isSidebarVisible")) ?? true);
  }, [user]);

  if (loading) {
    return <div className="text-white">Cargando...</div>; // Mostrar un mensaje de carga mientras se verifica la autenticación
  }

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const isAuthorizedRole =
    user && (user.role === "Administrador Interno" || user.role === "Personal Contable");

  return (
    <div className="bg-white text-black flex">
      {!isLoginPage &&  isAuthorizedRole && isSidebarVisible && <Sidebar />}
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
                <PrivateRoute
                  roles={["Administrador Interno", "Personal Contable"]}
                >
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute roles={["Administrador Interno", "Personal Contable"]}>
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
              path="/view-companies"
              element={
                <PrivateRoute roles={["Administrador Interno", "Personal Contable"]}>
                  <CompanyList />
                </PrivateRoute>
              }
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
