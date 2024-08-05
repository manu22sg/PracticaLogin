import { logUserEvent } from '../controllers/logController.js';

const methodToEventType = {
  GET: 'connect',
  PATCH: 'update',
  POST: 'connect',
  POST: 'disconnect',
    DELETE: 'delete',
};

export const logEvent = async (req, res, next) => {
  const eventType = methodToEventType[req.method]; // Determina el tipo de evento basado en el método HTTP
  const ipAddress = req.ip; // Obtener la dirección IP del usuario
  const browserInfo = req.headers['user-agent']; // Obtener la información del navegador

  try {
    if (req.user) {
      // Registrar el evento del usuario
      await logUserEvent(req.user.id, eventType, ipAddress, browserInfo);
    }
  } catch (error) {
    console.error('Error logging event:', error);
  }

  next(); // Continuar con la siguiente función de middleware o la ruta
};