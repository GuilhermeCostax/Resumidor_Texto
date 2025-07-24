from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ..models.database import User, Summary
from ..models.schemas import UserCreate
from .auth_service import AuthService
from typing import Optional, List

class UserService:
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> Optional[User]:
        """Cria um novo usuário"""
        try:
            hashed_password = AuthService.get_password_hash(user_data.password)
            db_user = User(
                email=user_data.email,
                username=user_data.email.split('@')[0],  # Usar parte do email como username
                name=user_data.name,
                hashed_password=hashed_password
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            return db_user
        except IntegrityError:
            db.rollback()
            return None
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Busca usuário por email"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """Busca usuário por ID"""
        return db.query(User).filter(User.id == user_id).first()
    
    @staticmethod
    def get_user_summaries(db: Session, user_id: int, skip: int = 0, limit: int = 10, search_term: str = None) -> List[Summary]:
        """Busca histórico de resumos do usuário com paginação e filtragem"""
        query = db.query(Summary).filter(Summary.user_id == user_id)
        
        # Aplicar filtro de busca se fornecido
        if search_term:
            search_pattern = f"%{search_term}%"
            query = query.filter(
                # Busca no texto original ou no resumo
                (Summary.original_text.ilike(search_pattern) | 
                 Summary.summary_text.ilike(search_pattern))
            )
        
        return query.order_by(Summary.created_at.desc()).offset(skip).limit(limit).all()
        
    @staticmethod
    def count_user_summaries(db: Session, user_id: int, search_term: str = None) -> int:
        """Conta o total de resumos do usuário com filtragem opcional"""
        query = db.query(Summary).filter(Summary.user_id == user_id)
        
        # Aplicar filtro de busca se fornecido
        if search_term:
            search_pattern = f"%{search_term}%"
            query = query.filter(
                # Busca no texto original ou no resumo
                (Summary.original_text.ilike(search_pattern) | 
                 Summary.summary_text.ilike(search_pattern))
            )
            
        return query.count()
    
    @staticmethod
    def delete_user_summary(db: Session, summary_id: int, user_id: int) -> bool:
        """Deleta um resumo específico do usuário"""
        summary = db.query(Summary).filter(
            Summary.id == summary_id,
            Summary.user_id == user_id
        ).first()
        
        if not summary:
            return False
        
        db.delete(summary)
        db.commit()
        return True
    
    @staticmethod
    def create_summary(db: Session, user_id: int, original_text: str, summary_text: str) -> Summary:
        """Cria um novo resumo para o usuário"""
        db_summary = Summary(
            user_id=user_id,
            original_text=original_text,
            summary_text=summary_text
        )
        db.add(db_summary)
        db.commit()
        db.refresh(db_summary)
        return db_summary