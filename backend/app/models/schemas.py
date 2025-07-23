from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# Schemas de Autenticação
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    email: str
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Schemas de Resumo
class ResumoRequest(BaseModel):
    texto_a_resumir: str

class ResumoResponse(BaseModel):
    id: int
    resumo: str
    created_at: datetime
    status: str = "success"

class SummaryHistory(BaseModel):
    id: int
    original_text: str
    summary_text: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserWithSummaries(User):
    summaries: List[SummaryHistory] = []