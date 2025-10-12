# tests/conftest.py
import pytest
import sys
import os
from pathlib import Path
from dotenv import load_dotenv, find_dotenv

# Añadir el directorio raíz al path
sys.path.insert(0, str(Path(__file__).parent.parent))

# ✅ Cargar .env al inicio de todos los tests
load_dotenv(find_dotenv())

# Verificar que se cargaron las variables
@pytest.fixture(scope="session", autouse=True)
def verify_env():
    """Verifica que las variables de entorno críticas existan"""
    required_vars = ["MAIL_USERNAME", "MAIL_PASSWORD", "MAIL_FROM"]
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        pytest.fail(
            f"❌ Faltan variables de entorno en .env: {', '.join(missing)}\n"
            f"Ubicación esperada del .env: {Path.cwd() / '.env'}"
        )
    
    print(f"\n✅ Variables de entorno cargadas correctamente")
    print(f"📧 MAIL_USERNAME: {os.getenv('MAIL_USERNAME')}")
    print(f"📧 MAIL_FROM: {os.getenv('MAIL_FROM')}")

@pytest.fixture
def test_email():
    """Email de prueba para los tests"""
    return os.getenv("MAIL_FROM")  # Usar el mismo email configurado

@pytest.fixture
def test_code():
    """Código de verificación de prueba"""
    return "123456"
