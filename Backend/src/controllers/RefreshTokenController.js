import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../middlewares/authMiddleware.js";

const generateAccessTokenFromRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No hay refresh token" });
  }

  try {
    const verified = verifyRefreshToken(refreshToken);

    if (!verified) {
      return res.status(401).json({ message: "Refresh token inválido" });
    }

    const user = { id: verified.userId };
    const newAccessToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Decide si actualizar el refresh token aquí o en otro lugar

    res.cookie("refreshToken", newRefreshToken, { httpOnly: true }); // Actualiza el refresh token
    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error al renovar token:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export default generateAccessTokenFromRefreshToken;
