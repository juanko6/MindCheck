from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.oauth import get_current_user, get_db
from app.models.user import User
from app.services.test_service import create_test, get_test_by_id, get_user_tests
from app.services.openai_service import generar_preguntas_desde_pdf
from app.services.token_service import descontar_tokens_usuario

router = APIRouter(prefix="/api/v1/tests", tags=["tests"])

class GenerateTestDTO(BaseModel):
    pdf_url: str
    paginas: List[int]
    numero_preguntas: int
    dificultad: str

@router.post("/generate")
async def generate_test(
    datos: GenerateTestDTO,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
    ):
    
    costo = datos.numero_preguntas * 10
    if not user.tokens or user.tokens < costo:
        raise HTTPException(status_code=400, detail="No tienes suficientes tokens")

    preguntas = await generar_preguntas_desde_pdf(
        pdf_url=datos.pdf_url,
        paginas=datos.paginas,
        cantidad=datos.numero_preguntas,
        dificultad=datos.dificultad
    )

    if not preguntas:
        raise HTTPException(status_code=500, detail="Error generando preguntas")

    await descontar_tokens_usuario(db=db, user=user, cantidad=costo)

    test = await create_test(
        user_id=user.id,
        title=f"Test de PDF: {datos.pdf_url}",
        data=preguntas,
        db=db
    )

    return {"testId": test.id}


@router.get("/{test_id}")
async def get_test(
    test_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    test = await get_test_by_id(test_id, db)
    if not test or test.user_id != user.id:
        raise HTTPException(status_code=404, detail="Test no encontrado o acceso denegado")
    return test.data

@router.get("/")
async def list_user_tests(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await get_user_tests(user_id=user.id, db=db)
