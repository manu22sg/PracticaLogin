import api from './api';
export const getRegiones = async () => {
    try {
      const response = await api.get('/regiones');
      return response;
    } catch (error) {
      console.error('Error al obtener regiones en services:', error);
      throw error;
    }
  };
  
  // Obtener provincias por región
  export const getProvincias = async (regionId) => {
    try {
      const response = await api.get(`/provincias`, {
        params: { regionId } // Enviar regionId como parámetro de consulta
      });
      return response;
    } catch (error) {
      console.error('Error al obtener provincias:', error);
      throw error;
    }
  };
  
  
  // Obtener comunas por provincia
  export const getComunas = async (provinciaId) => {
    try {
      const response = await api.get('/comunas', {
        params: { provinciaId } // Enviar provinciaId como parámetro de consulta
      });
      return response;
    } catch (error) {
      console.error('Error al obtener comunas:', error);
      throw error;
    }
  };
  