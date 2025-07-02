from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from datetime import datetime
from typing import List, Any
from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import aliased
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.oauth import get_current_user, get_db
from app.models.user import User
from app.models.test_result import TestResult
from app.models.test import Test
from app.services.test_service import create_test, get_test_by_id, get_user_tests
from app.services.openai_service import generar_preguntas_desde_pdf
from app.services.token_service import descontar_tokens_usuario
from app.services.test_result_service import submit_test_result

router = APIRouter(prefix="/api/v1/tests", tags=["tests"])

class TestHistoryResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    porcentaje: Optional[int] = None
    dificultad: Optional[str] = None

@router.get("/history", response_model=List[TestHistoryResponse])
async def get_test_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = (
        select(
            TestResult.id,
            Test.title,
            TestResult.created_at,   # 🟢 usamos created_at de TestResult
            TestResult.porcentaje,
            Test.dificultad
        )
        .join(Test, Test.id == TestResult.test_id)  # 🛠 JOIN explícito y correcto
        .where(TestResult.user_id == current_user.id)
        .order_by(TestResult.created_at.desc())     # 🟢 orden del más reciente al más antiguo
    )
    result = await db.execute(query)
    records = result.all()
    
    return [
        TestHistoryResponse(
            id=id_,
            title=title,
            created_at=created_at,
            porcentaje=porcentaje,
            dificultad=dificultad
        )
        for id_, title, created_at, porcentaje, dificultad in records
    ]

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
    print("🟢 Datos recibidos en generate_test:", datos.dict())  # <--- agrega esto
    
    costo = len(datos.paginas) * 10
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
        dificultad=datos.dificultad,
        data=preguntas,
        db=db
    )

    return {
        "dificultad": test.dificultad,
        "testId": test.id
        }


@router.get("/{test_id}")
async def get_test(
    test_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    test = await get_test_by_id(test_id, db)
    if not test or test.user_id != user.id:
        raise HTTPException(status_code=404, detail="Test no encontrado o acceso denegado")
    return {
        "preguntas": test.data.get("preguntas", []),
        "dificultad": test.dificultad,
        "title": test.title
    }

@router.get("/")
async def list_user_tests(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    return await get_user_tests(user_id=user.id, db=db)


class SubmitResultDTO(BaseModel):
    respuestas: list  # Lista de objetos con pregunta, seleccionada, correcta, etc.
    porcentaje: int

@router.post("/{test_id}/submit")
async def submit_test_result_endpoint(
    test_id: int,
    payload: SubmitResultDTO,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return await submit_test_result(
        user_id=user.id,
        test_id=test_id,
        respuestas=payload.respuestas,
        porcentaje=payload.porcentaje,
        db=db
    )
