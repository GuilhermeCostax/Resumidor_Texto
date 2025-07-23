from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from ..config.database import get_db
from ..services.auth_service import AuthService
from ..services.user_service import UserService
from ..models.database import User

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Dependency para obter usuário atual autenticado"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = AuthService.verify_token(credentials.credentials)
    if token_data is None or token_data.email is None:
        raise credentials_exception
    
    user = UserService.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    
    return user