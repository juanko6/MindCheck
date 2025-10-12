# tests/test_email.py
import pytest
import asyncio
from app.services.email_service import send_verification_email

class TestEmailService:
    """Tests para el servicio de envío de emails"""
    
    @pytest.mark.asyncio
    async def test_send_verification_email_success(self, test_email, test_code):
        """Test: envío exitoso de email de verificación"""
        try:
            result = await send_verification_email(test_email, test_code)
            assert result == True
            print(f"✅ Email enviado correctamente a {test_email}")
        except Exception as e:
            pytest.fail(f"❌ Error enviando email: {str(e)}")
    
    @pytest.mark.asyncio
    async def test_send_verification_email_invalid_email(self, test_code):
        """Test: email inválido debe fallar"""
        with pytest.raises(Exception):
            await send_verification_email("email-invalido", test_code)
    
    @pytest.mark.asyncio
    async def test_send_verification_email_empty_code(self, test_email):
        """Test: código vacío debe fallar"""
        with pytest.raises(Exception):
            await send_verification_email(test_email, "")

# Test simple para ejecutar manualmente
async def manual_test():
    """Test manual rápido"""
    email = "tu-email@gcloud.ua.es"  # Cambia esto por tu email
    code = "123456"
    
    try:
        await send_verification_email(email, code)
        print(f"✅ Email de prueba enviado a {email}")
        print(f"🔐 Código: {code}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    # Ejecutar test manual
    asyncio.run(manual_test())
