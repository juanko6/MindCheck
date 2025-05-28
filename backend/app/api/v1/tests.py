from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.oauth import get_current_user, get_db
from app.models.user import User
from app.services.test_service import create_test, get_user_tests

router = APIRouter(prefix="/api/v1/tests", tags=["tests"])

class SaveTestDTO(BaseModel):
    title: str
    data: Any  # Puede ser List[PreguntaDTO] si quieres tipado estricto

@router.post("/")
async def save_test(
    test: SaveTestDTO,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return await create_test(user_id=user.id, title=test.title, data=test.data, db=db)

@router.get("/")
async def list_user_tests(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await get_user_tests(user_id=user.id, db=db)
