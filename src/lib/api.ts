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
    verifyResetToken: '/api/auth/verify-reset-token',
  },
  summaries: {
    create: '/api/resumir-texto',
    list: '/api/historico',
    delete: (id: number) => `/api/historico/${id}`,
    export: '/api/historico/export',
  },
};

// Função helper para fazer requisições autenticadas com fallback
export const apiRequest = async (endpoint: string, options: RequestInit = {}, fallbackEndpointFn?: (originalEndpoint: string) => Promise<Response>) => {
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

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Se a resposta for bem-sucedida, retorna normalmente
    if (response.ok) {
      return response;
    }
    
    // Se for um erro 5xx (erro do servidor), tenta o endpoint de fallback
    if (response.status >= 500 && fallbackEndpointFn) {
      console.warn(`Erro ${response.status} ao acessar ${endpoint}. Tentando fallback...`);
      return await fallbackEndpointFn(endpoint);
    }
    
    // Para outros erros (4xx), retorna a resposta original
    return response;
  } catch (error) {
    // Em caso de erro de rede ou outro erro não tratado, usa o fallback
    console.error(`Erro ao acessar ${endpoint}:`, error);
    if (fallbackEndpointFn) {
      return await fallbackEndpointFn(endpoint);
    }
    // Se não houver fallback, retorna um erro genérico
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Erro de conexão',
        is_fallback: false
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

// A função useFallbackEndpoint foi movida para src/hooks/use-fallback-endpoint.ts

// Função helper para requisições POST
export const apiPost = async (endpoint: string, data: Record<string, unknown>, fallbackEndpointFn?: (originalEndpoint: string) => Promise<Response>) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }, fallbackEndpointFn);
};

// Função helper para requisições GET
export const apiGet = async (endpoint: string, fallbackEndpointFn?: (originalEndpoint: string) => Promise<Response>) => {
  return apiRequest(endpoint, {
    method: 'GET',
  }, fallbackEndpointFn);
};

// Função helper para requisições DELETE
export const apiDelete = async (endpoint: string, fallbackEndpointFn?: (originalEndpoint: string) => Promise<Response>) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
  }, fallbackEndpointFn);
};
