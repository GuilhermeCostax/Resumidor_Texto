// Configuração centralizada da API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

// Endpoints da API
export const API_ENDPOINTS = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    me: '/api/auth/me',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    validateResetToken: '/api/auth/validate-reset-token',
    verifyResetToken: '/api/auth/verify-reset-token'
  },
  summaries: {
    create: '/api/resumir-texto',
    list: '/api/historico',
    delete: (id: number) => `/api/historico/${id}`
  }
};

// Função helper para fazer requisições autenticadas
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return response;
};

// Função helper para requisições POST
export const apiPost = async (endpoint: string, data: Record<string, unknown>) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Função helper para requisições GET
export const apiGet = async (endpoint: string) => {
  return apiRequest(endpoint, {
    method: 'GET',
  });
};

// Função helper para requisições DELETE
export const apiDelete = async (endpoint: string) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
  });
};