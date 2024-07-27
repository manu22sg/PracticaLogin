import axios from "axios";
import cookies from "cookie-universal";

const API_URL = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Intentar renovar el token
      const refreshToken = cookies.get("refreshToken");
      if (refreshToken) {
        return instance
          .post("/api/auth/refreshtoken", { refreshToken })
          .then((response) => {
            const newAccessToken = response.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            // Repetir la solicitud original
            const retryOriginalRequest = new Promise((resolve, reject) => {
              const retryConfig = error.config;
              retryConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;
              resolve(instance(retryConfig));
            });
            return retryOriginalRequest;
          })
          .catch((error) => {
            // Manejar error de renovación
            localStorage.removeItem("accessToken");
            cookies.remove("refreshToken");
            window.location.href = "/login";
            return Promise.reject(error);
          });
      } else {
        // No hay refresh token, redireccionar al login
        localStorage.removeItem("accessToken");
        cookies.remove("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
