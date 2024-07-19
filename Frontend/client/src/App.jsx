import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
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
import UserList from "./components/userList";
import EditUserForm from "./components/EditUserForm";
import CreateUserForm from "./components/CreateUserForm";
import ViewUsers from "./components/ViewUsers";
import Navbar from "./components/navBar";
import CompanyList from "./components/CompanyList";
import "./App.css";

const AppContent = () => {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);
  const isLoginPage = location.pathname === "/login";

  if (loading) {
    return <div className="text-white">Cargando...</div>; // Mostrar un mensaje de carga mientras se verifica la autenticación
  }

  return (
    <div className="bg-white text-black">
      {!isLoginPage && <Navbar />}
      <div className="container mx-auto py-4 flex">
        <div className="flex-1 p-4">
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
            >
              <Route
                path="users"
                element={
                  <PrivateRoute roles={["Administrador Interno"]}>
                    <UserList />
                  </PrivateRoute>
                }
              ></Route>
            </Route>
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
              path="/edit-user"
              element={
                <PrivateRoute roles={["Administrador Interno"]}>
                  <UserList />
                </PrivateRoute>
              }
            />
            <Route
              path="/view-users"
              element={
                <PrivateRoute roles={["Administrador Interno"]}>
                  <ViewUsers />
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
            <Route path="*" element={<Navigate to="/login" />} />
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
