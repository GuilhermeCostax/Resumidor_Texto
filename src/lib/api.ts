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

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Se a resposta for bem-sucedida, retorna normalmente
    if (response.ok) {
      return response;
    }
    
    // Se for um erro 5xx (erro do servidor), tenta o endpoint de fallback
    if (response.status >= 500) {
      console.warn(`Erro ${response.status} ao acessar ${endpoint}. Tentando fallback...`);
      return await useFallbackEndpoint(endpoint);
    }
    
    // Para outros erros (4xx), retorna a resposta original
    return response;
  } catch (error) {
    // Em caso de erro de rede ou outro erro não tratado, usa o fallback
    console.error(`Erro ao acessar ${endpoint}:`, error);
    return await useFallbackEndpoint(endpoint);
  }
};

// Função para usar o endpoint de fallback
async function useFallbackEndpoint(originalEndpoint: string): Promise<Response> {
  try {
    const fallbackResponse = await fetch(`${API_BASE_URL}/api/health/fallback`);
    
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      
      // Cria uma resposta simulada com os dados de fallback
      const mockResponse = new Response(
        JSON.stringify({
          success: true,
          message: fallbackData.message,
          data: fallbackData.fallback_data,
          is_fallback: true
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      return mockResponse;
    }
    
    // Se o fallback também falhar, retorna um erro genérico
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Serviço temporariamente indisponível',
        is_fallback: true
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    // Se tudo falhar, retorna um erro genérico
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Serviço temporariamente indisponível',
        is_fallback: true
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
