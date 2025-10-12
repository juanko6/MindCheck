# tests/test_registration_flow.py
import pytest
import asyncio
from datetime import datetime, timezone, timedelta
from app.services.auth_service import create_user, verify_email_code, authenticate_user, resend_verification_code
from app.services.email_service import send_verification_email
from app.db.database import SessionLocal
from sqlalchemy import delete
from app.models.user import User

@pytest.mark.asyncio
async def test_complete_registration_flow():
    """Test del flujo completo de registro y verificación"""
    
    test_email = "test_user@gcloud.ua.es"
    test_password = "SecurePass123!"
    
    async with SessionLocal() as db:
        try:
            # 1. Crear usuario
            print(f"\n{'='*50}")
            print(f"1️⃣ Creando usuario: {test_email}")
            print(f"{'='*50}")
            user, code = await create_user(test_email, test_password, db)
            
            assert user.email == test_email
            assert user.is_verified == False
            assert user.is_active == False
            assert user.verification_code is not None
            print(f"✅ Usuario creado correctamente")
            print(f"   - Email: {user.email}")
            print(f"   - Username: {user.username}")
            print(f"   - Código generado: {code}")
            print(f"   - is_verified: {user.is_verified}")
            print(f"   - is_active: {user.is_active}")
            
            # 2. Enviar email de verificación
            print(f"\n{'='*50}")
            print(f"2️⃣ Enviando email de verificación...")
            print(f"{'='*50}")
            await send_verification_email(test_email, code)
            print(f"✅ Email enviado exitosamente a {test_email}")
            print(f"   - Revisa tu bandeja de entrada")
            print(f"   - Código: {code}")
            
            # 3. Verificar código
            print(f"\n{'='*50}")
            print(f"3️⃣ Verificando código de activación...")
            print(f"{'='*50}")
            verified_user = await verify_email_code(test_email, code, db)
            
            assert verified_user.is_verified == True
            assert verified_user.is_active == True
            assert verified_user.verification_code is None
            assert verified_user.code_expiration is None
            print(f"✅ Usuario verificado correctamente")
            print(f"   - is_verified: {verified_user.is_verified}")
            print(f"   - is_active: {verified_user.is_active}")
            print(f"   - verification_code: {verified_user.verification_code}")
            
            # 4. Intentar login
            print(f"\n{'='*50}")
            print(f"4️⃣ Probando autenticación...")
            print(f"{'='*50}")
            authenticated_user = await authenticate_user(test_email, test_password, db)
            
            assert authenticated_user.email == test_email
            assert authenticated_user.is_verified == True
            print(f"✅ Autenticación exitosa")
            print(f"   - Email: {authenticated_user.email}")
            print(f"   - Username: {authenticated_user.username}")
            
            print(f"\n{'='*50}")
            print(f"🎉 FLUJO COMPLETO EXITOSO!")
            print(f"{'='*50}")
            print(f"\n📋 Resumen:")
            print(f"   1. ✅ Registro de usuario")
            print(f"   2. ✅ Envío de email con código")
            print(f"   3. ✅ Verificación de código")
            print(f"   4. ✅ Activación de cuenta")
            print(f"   5. ✅ Autenticación exitosa")
            print(f"\n")
            
        except Exception as e:
            print(f"\n❌ ERROR EN EL FLUJO:")
            print(f"   {str(e)}")
            import traceback
            traceback.print_exc()
            pytest.fail(f"Error en el flujo: {str(e)}")
            
        finally:
            # Limpiar: eliminar usuario de prueba
            print(f"\n🧹 Limpiando usuario de prueba...")
            await db.execute(delete(User).where(User.email == test_email))
            await db.commit()
            print(f"✅ Usuario de prueba eliminado")

@pytest.mark.asyncio
async def test_invalid_verification_code():
    """Test de código de verificación inválido"""
    
    test_email = "test_invalid@gcloud.ua.es"
    test_password = "SecurePass123!"
    
    async with AsyncSessionLocal() as db:
        try:
            # Crear usuario
            user, correct_code = await create_user(test_email, test_password, db)
            print(f"\n✅ Usuario creado: {test_email}")
            
            # Intentar con código incorrecto
            wrong_code = "999999"
            print(f"❌ Intentando verificar con código incorrecto: {wrong_code}")
            
            with pytest.raises(Exception) as exc_info:
                await verify_email_code(test_email, wrong_code, db)
            
            print(f"✅ Error capturado correctamente: {str(exc_info.value)}")
            
        finally:
            # Limpiar
            await db.execute(delete(User).where(User.email == test_email))
            await db.commit()

@pytest.mark.asyncio
async def test_expired_verification_code():
    """Test de código expirado"""
    
    test_email = "test_expired@gcloud.ua.es"
    test_password = "SecurePass123!"
    
    async with AsyncSessionLocal() as db:
        try:
            # Crear usuario
            user, code = await create_user(test_email, test_password, db)
            print(f"\n✅ Usuario creado: {test_email}")
            
            # Expirar el código manualmente
            user.code_expiration = datetime.now(timezone.utc) - timedelta(minutes=1)
            await db.commit()
            await db.refresh(user)
            print(f"⏰ Código expirado manualmente")
            
            # Intentar verificar con código expirado
            with pytest.raises(Exception) as exc_info:
                await verify_email_code(test_email, code, db)
            
            print(f"✅ Error de expiración capturado correctamente")
            
        finally:
            # Limpiar
            await db.execute(delete(User).where(User.email == test_email))
            await db.commit()

@pytest.mark.asyncio
async def test_resend_verification_code():
    """Test de reenvío de código de verificación"""
    
    test_email = "test_resend@gcloud.ua.es"
    test_password = "SecurePass123!"
    
    async with AsyncSessionLocal() as db:
        try:
            # Crear usuario
            user, first_code = await create_user(test_email, test_password, db)
            print(f"\n✅ Usuario creado: {test_email}")
            print(f"   Código inicial: {first_code}")
            
            # Reenviar código
            user, new_code = await resend_verification_code(test_email, db)
            print(f"✅ Código reenviado")
            print(f"   Nuevo código: {new_code}")
            
            # Enviar email con nuevo código
            await send_verification_email(test_email, new_code)
            print(f"✅ Email reenviado exitosamente")
            
            # Verificar con el nuevo código
            verified_user = await verify_email_code(test_email, new_code, db)
            assert verified_user.is_verified == True
            print(f"✅ Verificación exitosa con nuevo código")
            
        finally:
            # Limpiar
            await db.execute(delete(User).where(User.email == test_email))
            await db.commit()

# Función manual para ejecutar directamente
async def manual_test():
    """Test manual rápido - ejecutar con: python -m tests.test_registration_flow"""
    print("\n" + "="*60)
    print("🧪 TEST MANUAL DE FLUJO DE REGISTRO Y VERIFICACIÓN")
    print("="*60)
    
    await test_complete_registration_flow()

if __name__ == "__main__":
    asyncio.run(manual_test())
