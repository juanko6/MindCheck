import json
import re
import fitz  # PyMuPDF
from urllib.parse import unquote
from pathlib import PurePath
from pathlib import Path
from openai import OpenAI
from app.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

UPLOADS_PATH = Path("uploads")  # Ajusta si tu ruta de carga es diferente

async def generar_preguntas_desde_pdf(pdf_path: str, paginas: list, cantidad: int, dificultad: str):
    """
    Extrae texto desde las páginas seleccionadas del PDF y genera preguntas con IA.
    """
    real_path = Path(pdf_path)
    if not real_path.exists():
        raise FileNotFoundError(f"PDF no encontrado en: {real_path}")

    texto_total = ""
    try:
        doc = fitz.open(real_path)
        for num in paginas:
            page_index = int(num) - 1  # fitz usa 0-based
            if 0 <= page_index < len(doc):
                texto_total += doc[page_index].get_text()
    except Exception as e:
        print("❌ Error leyendo PDF:", e)
        raise ValueError("Error al procesar el PDF")

    return await generar_preguntas(texto_total, numero_preguntas=cantidad, nivel_dificultad=dificultad)

async def generar_preguntas(texto, numero_preguntas=5, nivel_dificultad="Modo Relax"):
    if not texto or len(texto.strip()) < 300:
        raise ValueError("Contenido del PDF muy corto.")

    num_oraciones = texto.count('.') + texto.count('!') + texto.count('?')
    if num_oraciones < 3:
        raise ValueError("No hay suficientes oraciones para generar preguntas.")

    solo_texto = re.sub(r'[^a-zA-ZáéíóúÁÉÍÓÚñÑ]', '', texto)
    if len(solo_texto) < 100:
        raise ValueError("El contenido parece no ser texto académico.")

    texto = texto[:57000]  # Limitar longitud para prompt

    prompt = f"""
A partir del siguiente texto académico, genera un ARRAY JSON con {numero_preguntas} preguntas de selección múltiple.

Nivel de dificultad: {nivel_dificultad}.

Formato:
{{
"pregunta": "Texto de la pregunta",
"opcion1": "Primera opción",
"opcion2": "Segunda opción",
"opcion3": "Tercera opción",
"opcion4": "Cuarta opción",
"respuesta": índice (0 a 3)
}}

IMPORTANTE:
- En la respuesta debes de poner el indice de la opcion correcta
- SOLO devuelve el array JSON.
- No pongas ``` ni comentarios.
- No pongas texto adicional.

Texto:
{texto}
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[
            {"role": "system", "content": "Eres un generador de tests en JSON."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
    )

    preguntas_json = response.choices[0].message.content

    print("🔍 Raw JSON recibido de OpenAI:")
    print(preguntas_json)

    if not preguntas_json or preguntas_json.strip() == "":
        print("⚠️ OpenAI no devolvió contenido.")
        return {"preguntas": []}

    try:
        preguntas = json.loads(preguntas_json)

        if isinstance(preguntas, dict) and "preguntas" in preguntas:
            preguntas = preguntas["preguntas"]

    except json.JSONDecodeError as e:
        print("Error al parsear JSON:", e)
        print("Contenido recibido:", preguntas_json)
        preguntas = []

    resultado = { "preguntas": preguntas }
    print("✅ Resultado final enviado al frontend:")
    print(json.dumps(resultado, indent=2, ensure_ascii=False))
    return resultado
