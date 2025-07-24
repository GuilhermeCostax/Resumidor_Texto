import secrets
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from app.models.database import User, PasswordResetToken
from app.services.auth_service import AuthService
from app.services.email_service import EmailService

class PasswordResetService:
    @staticmethod
    def generate_reset_token() -> str:
        """Gera um token seguro para recuperação de senha"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def create_reset_token(db: Session, email: str) -> Optional[str]:
        """Cria um token de recuperação de senha para o usuário"""
        # Buscar usuário por email
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None
        
        # Invalidar tokens anteriores do usuário
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used == 0
        ).update({"used": 1})
        
        # Gerar novo token
        token = PasswordResetService.generate_reset_token()
        expires_at = datetime.utcnow() + timedelta(hours=1)  # Token expira em 1 hora
        
        # Salvar token no banco
        reset_token = PasswordResetToken(
            user_id=user.id,
            token=token,
            expires_at=expires_at
        )
        db.add(reset_token)
        db.commit()
        
        return token
    
    @staticmethod
    def send_reset_email(db: Session, email: str) -> bool:
        """Cria token e envia email de recuperação"""
        token = PasswordResetService.create_reset_token(db, email)
        if not token:
            return False
        
        # Enviar email
        return EmailService.send_password_reset_email(email, token)
    
    @staticmethod
    def validate_reset_token(db: Session, token: str) -> Optional[User]:
        """Valida token de recuperação e retorna o usuário"""
        reset_token = db.query(PasswordResetToken).filter(
            PasswordResetToken.token == token,
            PasswordResetToken.used == 0,
            PasswordResetToken.expires_at > datetime.utcnow()
        ).first()
        
        if not reset_token:
            return None
        
        return reset_token.user
    
    @staticmethod
    def reset_password(db: Session, token: str, new_password: str) -> bool:
        """Redefine a senha do usuário usando o token"""
        # Validar token
        reset_token = db.query(PasswordResetToken).filter(
            PasswordResetToken.token == token,
            PasswordResetToken.used == 0,
            PasswordResetToken.expires_at > datetime.utcnow()
        ).first()
        
        if not reset_token:
            return False
        
        # Buscar usuário
        user = db.query(User).filter(User.id == reset_token.user_id).first()
        if not user:
            return False
        
        # Atualizar senha
        user.hashed_password = AuthService.get_password_hash(new_password)
        
        # Marcar token como usado
        reset_token.used = 1
        
        db.commit()
        return True