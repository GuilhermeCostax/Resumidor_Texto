/**
 * Hook para fornecer o endpoint de fallback para requisições API
 * Este hook é usado pelos componentes que precisam fazer requisições com fallback
 */

import { API_BASE_URL } from '@/lib/api';

/**
 * Hook que retorna uma função para acessar o endpoint de fallback
 * @returns Uma função que recebe o endpoint original e retorna uma resposta simulada
 */
export function useFallbackEndpoint() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return async function getFallbackResponse(_originalEndpoint: string): Promise<Response> {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
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
}