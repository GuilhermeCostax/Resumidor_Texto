from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..config.database import get_db
from ..models.schemas import UserCreate, UserLogin, Token, User, ForgotPasswordRequest, ResetPasswordRequest, MessageResponse
from ..services.auth_service import AuthService
from ..services.user_service import UserService
from ..services.password_reset_service import PasswordResetService
from ..config.settings import get_settings
from ..dependencies.auth import get_current_user

settings = get_settings()
router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Registra um novo usuário"""
    # Verifica se usuário já existe
    existing_user = UserService.get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Cria novo usuário
    user = UserService.create_user(db, user_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not create user. Username or email might already exist."
        )
    
    return user

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Autentica usuário e retorna token JWT"""
    user = AuthService.authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = AuthService.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Retorna informações do usuário atual"""
    return current_user

@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Solicita recuperação de senha"""
    # Sempre retorna sucesso por segurança (não revela se email existe)
    PasswordResetService.send_reset_email(db, request.email)
    return {"message": "Se o email estiver cadastrado, você receberá as instruções de recuperação."}

@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Redefine a senha usando o token"""
    success = PasswordResetService.reset_password(db, request.token, request.new_password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token inválido ou expirado"
        )
    return {"message": "Senha redefinida com sucesso!"}

@router.get("/validate-reset-token/{token}")
async def validate_reset_token(token: str, db: Session = Depends(get_db)):
    """Valida se o token de recuperação é válido"""
    user = PasswordResetService.validate_reset_token(db, token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token inválido ou expirado"
        )
    return {"valid": True, "email": user.email}