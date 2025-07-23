from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from ..config.database import get_db
from ..models.schemas import ResumoRequest, ResumoResponse, SummaryHistory
from ..models.database import User
from ..services.gemini_service import GeminiService
from ..services.user_service import UserService
from ..dependencies.auth import get_current_user

router = APIRouter(prefix="/api", tags=["resumo"])
gemini_service = GeminiService()

@router.post("/resumir-texto", response_model=ResumoResponse)
async def resumir_texto(
    request: ResumoRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Resumir texto e salvar no histórico do usuário"""
    try:
        # Gera o resumo usando IA
        resumo = gemini_service.resumir_texto(request.texto_a_resumir)
        
        # Salva no histórico do usuário
        summary_record = UserService.create_summary(
            db=db,
            user_id=current_user.id,
            original_text=request.texto_a_resumir,
            summary_text=resumo
        )
        
        return ResumoResponse(
            id=summary_record.id,
            resumo=resumo,
            created_at=summary_record.created_at
        )
    except Exception as e:
        print(f"Erro ao resumir texto: {e}")
        raise HTTPException(status_code=500, detail="Erro ao resumir texto")

@router.get("/historico", response_model=List[SummaryHistory])
async def get_historico(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna o histórico de resumos do usuário"""
    summaries = UserService.get_user_summaries(db, current_user.id)
    return summaries