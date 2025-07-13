import os
import stat 
import traceback
from pathlib import Path
from urllib.parse import unquote
from fastapi import APIRouter, UploadFile, File, Request, Body, HTTPException
from app.services.openai_service import generar_explicacion
from app.services.pdf_reader import extract_text_from_pdf
from app.services.openai_service import generar_preguntas

router = APIRouter(prefix="/api/v1/testController", tags=["test"])

@router.post("/generate-questions")
async def generate_questions(data: dict = Body(...)):
    # Obtener datos del body
    filename = data["pdfUrl"]
    paginas = data["paginas"]
    numero_preguntas = data["numeroPreguntas"]
    dificultad = data["nivelDificultad"]

    # Decodificar nombre de archivo por si viene con caracteres especiales codificados (espacios, tildes)
    filename = unquote(filename)
    pdf_path = os.path.join("uploads", filename)

    print("📥 Recibida solicitud para generar preguntas:")
    print(f"   - PDF: {pdf_path}")
    print(f"   - Páginas: {paginas}")
    print(f"   - Preguntas: {numero_preguntas}")
    print(f"   - Dificultad: {dificultad}")
    print(f"📁 Verificando existencia del archivo: {pdf_path}")
    print(f"   - ¿Existe? {os.path.exists(pdf_path)}")

    # Verificar que el archivo existe
    if not os.path.exists(pdf_path):
        print(f"❌ El archivo PDF no se encontró: {pdf_path}")
        raise HTTPException(status_code=404, detail="Archivo PDF no encontrado")

    try:
        with open(pdf_path, "rb") as file:
            class FileWrapper:
                def __init__(self, file): self.file = file
            texto = await extract_text_from_pdf(FileWrapper(file), paginas)

        print(f"📄 Texto extraído (primeros 200 caracteres): {texto[:200]}")
        print(f"   - Longitud total del texto: {len(texto)} caracteres")

        preguntas = await generar_preguntas(texto, numero_preguntas, dificultad)
        print(f"✅ Preguntas generadas: {len(preguntas['preguntas'])}")

        return {"preguntas": preguntas}

    except Exception as e:
        print("❌ Error al generar preguntas:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Error generando preguntas")

@router.post("/explain")
async def explain_mistake(request: Request):
    data = await request.json()
    question = data.get("question")
    correct_answer = data.get("correctAnswer")

    explanation = await generar_explicacion(
        question, correct_answer
    )

    return {"explanation": explanation}
