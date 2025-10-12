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
from app.models.document import Document

router = APIRouter(prefix="/api/v1/tests", tags=["tests"])

class TestHistoryResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    porcentaje: Optional[int] = None
    dificultad: Optional[str] = None

class GenerateTestFromTextDTO(BaseModel):
    texto: str
    numero_preguntas: int
    dificultad: str
    titulo_test: str

@router.get("/history", response_model=List[TestHistoryResponse])
async def get_test_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = (
        select(
            TestResult.test_id,
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
            id=test_id,
            title=title,
            created_at=created_at,
            porcentaje=porcentaje,
            dificultad=dificultad
        )
        for test_id, title, created_at, porcentaje, dificultad in records
    ]

class GenerateTestDTO(BaseModel):
    document_id: int
    paginas: List[int]
    numero_preguntas: int
    dificultad: str

@router.post("/generate")
async def generate_test(
    datos: GenerateTestDTO,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    print("🟢 Datos recibidos en generate_test:", datos.dict())

    # Verifica tokens disponibles
    costo = len(datos.paginas) * 10
    if not user.tokens or user.tokens < costo:
        raise HTTPException(status_code=400, detail="No tienes suficientes tokens")

    # Obtiene documento por ID y valida que sea del usuario
    result = await db.execute(select(Document).where(Document.id == datos.document_id))
    document = result.scalar_one_or_none()

    if not document or document.owner_id != user.id:
        raise HTTPException(status_code=403, detail="Documento no válido o no autorizado")

    # Genera preguntas desde archivo local
    preguntas = await generar_preguntas_desde_pdf(
        pdf_path=document.path,  # 🟢 usa ruta real
        paginas=datos.paginas,
        cantidad=datos.numero_preguntas,
        dificultad=datos.dificultad
    )

    if not preguntas:
        raise HTTPException(status_code=500, detail="Error generando preguntas")

    # Descontar tokens
    await descontar_tokens_usuario(db=db, user=user, cantidad=costo)

    # Crear test
    test = await create_test(
        user_id=user.id,
        title=f"Test de PDF: {document.filename}",
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

@router.post("/generate-from-text")
async def generate_test_from_text(
    datos: GenerateTestFromTextDTO,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    print("🟢 Datos recibidos en generate_test_from_text:", datos.dict())
    
    # Validar que hay texto
    if not datos.texto or len(datos.texto.strip()) < 100:
        raise HTTPException(status_code=400, detail="El texto es demasiado corto. Mínimo 100 caracteres.")
    
    # Calcular costo basado en palabras (igual que en el frontend)
    PALABRAS_POR_BLOQUE = 400
    TOKENS_POR_BLOQUE = 10
    
    word_count = len(datos.texto.strip().split())
    bloques = (word_count + PALABRAS_POR_BLOQUE - 1) // PALABRAS_POR_BLOQUE  # redondeo hacia arriba
    costo = bloques * TOKENS_POR_BLOQUE
    
    # Verificar tokens disponibles
    if not user.tokens or user.tokens < costo:
        raise HTTPException(
            status_code=400, 
            detail=f"No tienes suficientes tokens. Necesitas {costo}, pero tienes {user.tokens}"
        )
    
    # Generar preguntas desde el texto usando la función existente
    try:
        from app.services.openai_service import generar_preguntas
        
        preguntas = await generar_preguntas(
            texto=datos.texto,
            numero_preguntas=datos.numero_preguntas,
            nivel_dificultad=datos.dificultad
        )
        
        if not preguntas or not preguntas.get("preguntas"):
            raise HTTPException(status_code=500, detail="Error generando preguntas")
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"❌ Error al generar preguntas: {e}")
        raise HTTPException(status_code=500, detail="Error generando preguntas")
    
    # Descontar tokens
    await descontar_tokens_usuario(db=db, user=user, cantidad=costo)
    
    # Crear test
    test = await create_test(
        user_id=user.id,
        title=f"{datos.titulo_test} - {datos.dificultad}",
        dificultad=datos.dificultad,
        data=preguntas,
        db=db
    )
    
    return {
        "dificultad": test.dificultad,
        "testId": test.id
    }

