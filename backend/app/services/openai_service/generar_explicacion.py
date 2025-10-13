import os
from app.config import OPENAI_API_KEY
from openai import OpenAI

client = OpenAI(api_key=OPENAI_API_KEY)

MODELO_GPT = os.getenv("MODELO_GPT", "gpt-5-nano")
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.4"))

async def generar_explicacion(pregunta, respuesta_correcta):
    prompt = f"""
Explica de forma breve por qué la respuesta correcta a la pregunta "{pregunta}" es "{respuesta_correcta}".
No inventes información adicional.
"""

    response = client.chat.completions.create(
        model=MODELO_GPT,
        messages=[
            {"role": "system", "content": "Eres un profesor experto que da explicaciones claras y concisas."},
            {"role": "user", "content": prompt}
        ],
        temperature=TEMPERATURE,
    )

    return response.choices[0].message.content
