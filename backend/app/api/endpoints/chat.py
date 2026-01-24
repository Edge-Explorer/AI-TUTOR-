from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.models import User, ChatHistory
from app.schemas.schemas import ChatCreate, ChatResponse
from app.api.deps import get_current_user
from app.services.ollama_service import ollama_service

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def create_chat(
    chat_in: ChatCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get response from AI
    ai_response = await ollama_service.generate_response(chat_in.message)
    
    # Save to history
    chat_db = ChatHistory(
        user_id=current_user.id,
        message=chat_in.message,
        response=ai_response,
        topic=chat_in.topic
    )
    db.add(chat_db)
    db.commit()
    db.refresh(chat_db)
    
    return chat_db

@router.get("/history", response_model=List[ChatResponse])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    history = db.query(ChatHistory).filter(ChatHistory.user_id == current_user.id).all()
    return history
