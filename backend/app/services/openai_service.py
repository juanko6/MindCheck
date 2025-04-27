# backend/app/services/openai_service.py
import json, re
from openai import OpenAI
from app.config import OPENAI_API_KEY

# Inicializar cliente de OpenAI
client = OpenAI(api_key=OPENAI_API_KEY)

async def generar_preguntas(texto, numero_preguntas=5, nivel_dificultad="Modo Relax"):

    if not texto or len(texto.strip()) < 300:  # ⚡ mínimo 300 caracteres razonables
        raise ValueError("El contenido del PDF es demasiado corto o vacío.")

    # 🔥 Contar cantidad de puntos (oraciones)
    num_oraciones = texto.count('.') + texto.count('!') + texto.count('?')
    if num_oraciones < 3:
        raise ValueError("El contenido parece no tener suficientes oraciones para generar preguntas.")

    # 🔥 Verificar que no sea solo números o símbolos
    solo_caracteres = re.sub(r'[^a-zA-ZáéíóúÁÉÍÓÚñÑ]', '', texto)
    if len(solo_caracteres) < 100:
        raise ValueError("El contenido parece no ser texto académico válido.")
    
    # ✅ Limitar el texto a máximo 12,000 caracteres para evitar exceso de tokens
    texto = texto[:12000] # maximo le puedo poner 56000 caracteres para este modelo 3.5

    prompt = f"""A partir del siguiente texto académico, genera un ARRAY JSON con {numero_preguntas} preguntas de selección múltiple.

    Dificultad: {nivel_dificultad}.

    Formato exacto para cada pregunta:
    {{
    "pregunta": "Pregunta aquí",
    "opcion1": "Primera opción",
    "opcion2": "Segunda opción",
    "opcion3": "Tercera opción",
    "opcion4": "Cuarta opción",
    "respuesta": "Texto exacto de la opción correcta"
    }}

    IMPORTANTE:
    - Devuelve **únicamente** el ARRAY JSON. 
    - **NO** envuelvas en bloques de código. 
    - **NO** uses ```json ni ```.
    - **NO** escribas texto adicional antes o después.
    - SOLO el array JSON final, listo para parsear.

    Texto:
    {texto}
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[
            {"role": "system", "content": "Eres un generador de tests que responde en JSON puro."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3,
    )

    preguntas_json = response.choices[0].message.content

    if not preguntas_json or preguntas_json.strip() == "":
        print("⚠️ OpenAI no devolvió contenido. Puede ser que el texto era muy grande o hubo un error.")
        preguntas = []
    else:
        try:
            preguntas = json.loads(preguntas_json)
        except json.JSONDecodeError as e:
            print("Error parsing JSON generado por OpenAI:", e)
            print("Contenido recibido:", preguntas_json)  # 👈 Para depurar si quieres
            preguntas = []

    return {"preguntas": preguntas}


async def generar_explicacion(pregunta, respuesta_correcta):
    prompt = f"""Explica brevemente por qué la respuesta correcta a la siguiente pregunta es "{respuesta_correcta}". Sé conciso y no inventes información extra.

Pregunta: {pregunta}
"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        messages=[
            {"role": "system", "content": "Eres un profesor experto que da explicaciones claras y breves."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.4,
    )

    return response.choices[0].message.content
