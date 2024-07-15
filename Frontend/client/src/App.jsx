import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
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
// Importa la Sidebar
import "./App.css";

const AppContent = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="App">
      {!isLoginPage && <Navbar />}
      <div className="main-content">
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
            <Route path="users" element={<UserList />} />
            <Route path="edit/:rut" element={<EditUserForm />} />
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
          <Route path="/create-user" element={<CreateUserForm />} />
          <Route path="/edit-user" element={<UserList />} />
          <Route path="/view-users" element={<ViewUsers />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
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
