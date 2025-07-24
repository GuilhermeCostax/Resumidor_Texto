from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from ..config.database import get_db
from ..config.settings import get_settings
import os

settings = get_settings()
router = APIRouter(prefix="/api/health", tags=["health"])

@router.get("/")
async def health_check():
    """Health check básico"""
    return {
        "status": "healthy",
        "service": "AI Text Summarizer API",
        "version": "2.0.0"
    }

@router.get("/detailed")
async def detailed_health_check(db: Session = Depends(get_db)):
    """Health check detalhado com verificação de dependências"""
    health_status = {
        "status": "healthy",
        "service": "AI Text Summarizer API",
        "version": "2.0.0",
        "checks": {
            "database": "unknown",
            "gemini_api": "unknown",
            "email_config": "unknown"
        }
    }
    
    # Verificar conexão com banco de dados
    try:
        db.execute(text("SELECT 1"))
        health_status["checks"]["database"] = "healthy"
    except Exception as e:
        health_status["checks"]["database"] = f"unhealthy: {str(e)}"
        health_status["status"] = "degraded"
    
    # Verificar configuração da API Gemini
    if settings.gemini_api_key and settings.gemini_api_key != "your_gemini_api_key_here":
        health_status["checks"]["gemini_api"] = "configured"
    else:
        health_status["checks"]["gemini_api"] = "not_configured"
        health_status["status"] = "degraded"
    
    # Verificar configuração de email
    if (settings.smtp_username and 
        settings.smtp_password and 
        settings.from_email and
        settings.smtp_username != "" and
        settings.smtp_password != ""):
        health_status["checks"]["email_config"] = "configured"
    else:
        health_status["checks"]["email_config"] = "not_configured"
    
    # Se algum check crítico falhou, retornar status 503
    if health_status["status"] == "degraded":
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=health_status
        )
    
    return health_status

@router.get("/ready")
async def readiness_check(db: Session = Depends(get_db)):
    """Readiness check para Kubernetes/Docker"""
    try:
        # Verificar se consegue conectar no banco
        db.execute(text("SELECT 1"))
        
        # Verificar se API key está configurada
        if not settings.gemini_api_key or settings.gemini_api_key == "your_gemini_api_key_here":
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Gemini API key not configured"
            )
        
        return {"status": "ready"}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service not ready: {str(e)}"
        )

@router.get("/live")
async def liveness_check():
    """Liveness check para Kubernetes/Docker"""
    return {"status": "alive"}