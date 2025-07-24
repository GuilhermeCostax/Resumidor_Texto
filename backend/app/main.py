from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import resumo, auth, health
from .config.settings import get_settings
from .config.database import engine
from .config.logging import setup_logging, get_logger
from .middleware.rate_limit import RateLimitMiddleware, AuthenticatedRateLimitMiddleware
from .models.database import Base
import logging.config

settings = get_settings()

# Configurar logging
setup_logging()
logger = get_logger("main")

# Criar tabelas do banco de dados
Base.metadata.create_all(bind=engine)
logger.info("Tabelas do banco de dados criadas/verificadas")

app = FastAPI(
    title=settings.app_name,
    description="API multiusuário para resumir textos longos usando IA",
    version="2.0.0"
)

# Configurar CORS
# Expressão regular que permite a URL de produção E qualquer URL de preview
# para o projeto "resumidor-texto" na Vercel.
allow_origin_regex = r"https://resumidor-texto.*\.vercel\.app"

# Também mantemos algumas origens específicas para desenvolvimento local
allowed_origins = [
    settings.frontend_url,
    "http://localhost:3000",  # Para desenvolvimento local
    "http://127.0.0.1:3000",  # Para desenvolvimento local
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allow_origin_regex,  # Usando regex para URLs dinâmicas da Vercel
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Rate limiting em produção
if not settings.debug:
    # Rate limit geral: 100 requests por minuto por IP
    app.add_middleware(RateLimitMiddleware, calls=100, period=60)
    # Rate limit para endpoints autenticados: 50 requests por minuto
    app.add_middleware(AuthenticatedRateLimitMiddleware, calls=50, period=60)
    logger.info("Rate limiting ativado para produção")

# Incluir rotas
app.include_router(auth.router)
app.include_router(resumo.router)
app.include_router(health.router)

@app.get("/")
def read_root():
    return {
        "message": "AI Text Summarizer API - Multiuser Version", 
        "status": "running",
        "version": "2.0.0",
        "features": ["User Authentication", "Personal History", "JWT Security"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
