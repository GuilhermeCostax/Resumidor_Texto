from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import csv
import io
from datetime import datetime
from ..config.database import get_db
from ..models.schemas import ResumoRequest, ResumoResponse, SummaryHistory, PaginatedSummaryResponse
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

@router.get("/historico", response_model=PaginatedSummaryResponse)
async def get_historico(
    skip: int = Query(0, ge=0, description="Número de itens para pular (paginação)"),
    limit: int = Query(10, ge=1, le=50, description="Número máximo de itens para retornar"),
    search: str = Query(None, description="Termo de busca para filtrar resumos"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retorna o histórico de resumos do usuário com paginação e filtragem"""
    summaries = UserService.get_user_summaries(db, current_user.id, skip, limit, search)
    total = UserService.count_user_summaries(db, current_user.id, search)
    
    return PaginatedSummaryResponse(
        items=summaries,
        total=total,
        skip=skip,
        limit=limit
    )

@router.delete("/historico/{summary_id}")
async def delete_summary(
    summary_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deleta um resumo específico do usuário"""
    success = UserService.delete_user_summary(db, summary_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Resumo não encontrado")
    return {"message": "Resumo deletado com sucesso"}

@router.get("/historico/export")
async def export_historico(
    search: str = Query(None, description="Termo de busca para filtrar resumos"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Exporta o histórico de resumos do usuário em formato CSV"""
    # Busca todos os resumos do usuário (sem paginação, mas com filtro de busca se fornecido)
    summaries = UserService.get_user_summaries(
        db, 
        current_user.id, 
        skip=0, 
        limit=1000,  # Limite alto para pegar a maioria dos resumos
        search_term=search
    )
    
    # Cria um buffer de memória para o CSV
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Escreve o cabeçalho
    writer.writerow(["ID", "Texto Original", "Resumo", "Data de Criação"])
    
    # Escreve os dados
    for summary in summaries:
        writer.writerow([
            summary.id,
            summary.original_text,
            summary.summary_text,
            summary.created_at.strftime("%Y-%m-%d %H:%M:%S")
        ])
    
    # Prepara a resposta
    output.seek(0)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"historico_resumos_{timestamp}.csv"
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )