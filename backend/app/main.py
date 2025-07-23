from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import resumo, auth
from .config.settings import get_settings
from .config.database import engine
from .models.database import Base

settings = get_settings()

# Criar tabelas do banco de dados
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    description="API multiusuário para resumir textos longos usando IA",
    version="2.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas
app.include_router(auth.router)
app.include_router(resumo.router)

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
