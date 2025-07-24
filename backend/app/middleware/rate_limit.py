from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict, Tuple
import time
from collections import defaultdict, deque
from ..config.logging import get_logger

logger = get_logger("rate_limit")

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Middleware para rate limiting baseado em IP.
    """
    
    def __init__(self, app, calls: int = 100, period: int = 60):
        super().__init__(app)
        self.calls = calls  # Número máximo de chamadas
        self.period = period  # Período em segundos
        self.clients: Dict[str, deque] = defaultdict(deque)
    
    def _get_client_ip(self, request: Request) -> str:
        """
        Extrai o IP do cliente, considerando proxies.
        """
        # Verificar headers de proxy
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # Fallback para IP direto
        return request.client.host if request.client else "unknown"
    
    def _is_rate_limited(self, client_ip: str) -> Tuple[bool, int]:
        """
        Verifica se o cliente excedeu o rate limit.
        Retorna (is_limited, remaining_calls)
        """
        now = time.time()
        client_calls = self.clients[client_ip]
        
        # Remove chamadas antigas (fora do período)
        while client_calls and client_calls[0] <= now - self.period:
            client_calls.popleft()
        
        # Verifica se excedeu o limite
        if len(client_calls) >= self.calls:
            return True, 0
        
        # Adiciona a chamada atual
        client_calls.append(now)
        remaining = self.calls - len(client_calls)
        
        return False, remaining
    
    async def dispatch(self, request: Request, call_next):
        # Pular rate limiting para health checks
        if request.url.path.startswith("/api/health"):
            return await call_next(request)
        
        client_ip = self._get_client_ip(request)
        is_limited, remaining = self._is_rate_limited(client_ip)
        
        if is_limited:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "Rate limit exceeded",
                    "message": f"Too many requests. Limit: {self.calls} per {self.period} seconds",
                    "retry_after": self.period
                },
                headers={
                    "X-RateLimit-Limit": str(self.calls),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(time.time() + self.period)),
                    "Retry-After": str(self.period)
                }
            )
        
        # Processar a requisição
        response = await call_next(request)
        
        # Adicionar headers de rate limit
        response.headers["X-RateLimit-Limit"] = str(self.calls)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(time.time() + self.period))
        
        return response

class AuthenticatedRateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting mais restritivo para endpoints autenticados.
    """
    
    def __init__(self, app, calls: int = 50, period: int = 60):
        super().__init__(app)
        self.calls = calls
        self.period = period
        self.clients: Dict[str, deque] = defaultdict(deque)
    
    def _get_client_identifier(self, request: Request) -> str:
        """
        Usa o token JWT ou IP como identificador.
        """
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            # Usar hash do token como identificador
            token = auth_header.split(" ")[1]
            return f"token_{hash(token)}"
        
        # Fallback para IP
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return f"ip_{forwarded_for.split(',')[0].strip()}"
        
        return f"ip_{request.client.host if request.client else 'unknown'}"
    
    async def dispatch(self, request: Request, call_next):
        # Aplicar apenas em endpoints que requerem autenticação
        protected_paths = [
            "/api/resumir-texto",
            "/api/historico",
            "/api/auth/me"
        ]
        
        if not any(request.url.path.startswith(path) for path in protected_paths):
            return await call_next(request)
        
        client_id = self._get_client_identifier(request)
        now = time.time()
        client_calls = self.clients[client_id]
        
        # Remove chamadas antigas
        while client_calls and client_calls[0] <= now - self.period:
            client_calls.popleft()
        
        # Verifica limite
        if len(client_calls) >= self.calls:
            logger.warning(f"Authenticated rate limit exceeded for: {client_id}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "Rate limit exceeded",
                    "message": f"Too many requests to protected endpoints. Limit: {self.calls} per {self.period} seconds"
                }
            )
        
        # Adiciona chamada atual
        client_calls.append(now)
        
        return await call_next(request)