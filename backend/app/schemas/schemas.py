from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None

# Chat Schemas
class ChatCreate(BaseModel):
    message: str
    topic: Optional[str] = "general"

class ChatResponse(BaseModel):
    message: str
    response: str
    topic: str
    created_at: datetime

    class Config:
        from_attributes = True
