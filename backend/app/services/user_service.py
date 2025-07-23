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
                username=user_data.username,
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
    def get_user_summaries(db: Session, user_id: int, limit: int = 50) -> List[Summary]:
        """Busca histórico de resumos do usuário"""
        return db.query(Summary).filter(
            Summary.user_id == user_id
        ).order_by(Summary.created_at.desc()).limit(limit).all()
    
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