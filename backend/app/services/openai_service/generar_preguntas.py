import json
from app.config import OPENAI_API_KEY
from openai import OpenAI
import re

client = OpenAI(api_key=OPENAI_API_KEY)

async def generar_preguntas(texto, numero_preguntas=5, nivel_dificultad="Modo Relax"):
    if not texto or len(texto.strip()) < 300:
        raise ValueError("Contenido del PDF muy corto.")

    num_oraciones = texto.count('.') + texto.count('!') + texto.count('?')
    if num_oraciones < 3:
        raise ValueError("No hay suficientes oraciones para generar preguntas.")

    solo_texto = re.sub(r'[^a-zA-ZáéíóúÁÉÍÓÚñÑ]', '', texto)
    if len(solo_texto) < 100:
        raise ValueError("El contenido parece no ser texto académico.")

    texto = texto[:12000]

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
"respuesta": "Texto exacto de la opción correcta"
}}

IMPORTANTE:
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

    if not preguntas_json or preguntas_json.strip() == "":
        print("⚠️ OpenAI no devolvió contenido.")
        return {"preguntas": []}

    try:
        preguntas = json.loads(preguntas_json)
    except json.JSONDecodeError as e:
        print("Error al parsear JSON:", e)
        print("Contenido recibido:", preguntas_json)
        preguntas = []

    if isinstance(preguntas, dict) and "preguntas" in preguntas:
        return preguntas
    else:
        return {"preguntas": preguntas}
