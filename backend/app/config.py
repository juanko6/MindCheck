#backend/app/config.py

import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ALLOWED_EMAIL_DOMAINS = os.getenv("ALLOWED_EMAIL_DOMAINS", "")

if not OPENAI_API_KEY:
    raise ValueError("❌ FALTA definir OPENAI_API_KEY en el archivo .env")

ALLOWED_EMAIL_DOMAINS = [domain.strip() for domain in ALLOWED_EMAIL_DOMAINS.split(",") if domain.strip()]
