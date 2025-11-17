import axios from 'axios';
import { getAuth } from 'firebase/auth';

// Configurar instância axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de request para adicionar token
api.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador de response para tratamento de erros
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response ${response.config.method.toUpperCase()} ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // Resposta com status de erro
      console.error(`❌ Error ${error.response.status}:`, error.response.data);
      
      if (error.response.status === 401) {
        // Não autenticado - redirecionar para login
        console.error('Sessão expirada. Faça login novamente.');
      }
      
      if (error.response.status === 403) {
        // Sem permissão
        console.error('Você não tem permissão para acessar este recurso.');
      }
    } else if (error.request) {
      // Requisição feita mas sem resposta
      console.error('❌ Erro na requisição:', error.request);
    } else {
      // Erro ao configurar requisição
      console.error('❌ Erro:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Métodos HTTP
const http = {
  // GET - Buscar dados
  get: async (endpoint, config = {}) => {
    try {
      const response = await api.get(endpoint, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
      };
    }
  },

  // POST - Criar dados
  post: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await api.post(endpoint, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
      };
    }
  },

  // PUT - Atualizar dados completos
  put: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await api.put(endpoint, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
      };
    }
  },

  // PATCH - Atualizar dados parciais
  patch: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await api.patch(endpoint, data, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
      };
    }
  },

  // DELETE - Remover dados
  delete: async (endpoint, config = {}) => {
    try {
      const response = await api.delete(endpoint, config);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
      };
    }
  },

  // HEAD - Verificar disponibilidade de recurso
  head: async (endpoint, config = {}) => {
    try {
      const response = await api.head(endpoint, config);
      return {
        success: true,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
      };
    }
  },

  // Configurar base URL dinamicamente
  setBaseURL: (url) => {
    api.defaults.baseURL = url;
  },

  // Adicionar header customizado
  setHeader: (key, value) => {
    api.defaults.headers.common[key] = value;
  },

  // Remover header customizado
  removeHeader: (key) => {
    delete api.defaults.headers.common[key];
  },

  // Upload de arquivo
  uploadFile: async (endpoint, file, fieldName = 'file', additionalData = {}) => {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);
      
      // Adicionar dados adicionais
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, additionalData[key]);
      });

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
      };
    }
  },

  // Download de arquivo
  downloadFile: async (endpoint, filename) => {
    try {
      const response = await api.get(endpoint, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);

      return {
        success: true,
        message: 'Arquivo baixado com sucesso',
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
      };
    }
  },
};

export default http;
