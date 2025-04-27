from fastapi import APIRouter, UploadFile, File, Request, Form
from app.services import pdf_reader, openai_service

router = APIRouter()

@router.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    numero_preguntas: int = Form(5),
    nivel_dificultad: str = Form("Modo Relax")
):
    contenido = await pdf_reader.extract_text_from_pdf(file)

    if not contenido or len(contenido.strip()) < 300:
        return {"preguntas": []}

    preguntas = await openai_service.generar_preguntas(
        contenido, numero_preguntas, nivel_dificultad
    )

    return preguntas

@router.post("/explain")
async def explain_mistake(request: Request):
    data = await request.json()
    question = data.get("question")
    correct_answer = data.get("correctAnswer")

    explanation = await openai_service.generar_explicacion(
        question, correct_answer
    )

    return {"explanation": explanation}
