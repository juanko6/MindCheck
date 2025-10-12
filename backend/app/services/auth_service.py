from fastapi import HTTPException, status

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.core.security import hash_password, verify_password
from app.config import ALLOWED_EMAIL_DOMAINS
from datetime import datetime, timedelta, timezone
import secrets
import hashlib


async def get_user_by_email(email: str, db: AsyncSession):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def get_user_by_username(username: str, db: AsyncSession):
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()


def is_institutional_email(email: str) -> bool:
    domain = email.split("@")[-1].lower()
    return domain in ALLOWED_EMAIL_DOMAINS


# ============ FUNCIONES PARA VERIFICACIÓN ============

def generate_verification_code() -> str:
    """Genera código de verificación de 6 dígitos de forma segura"""
    return ''.join([str(secrets.randbelow(10)) for _ in range(6)])


def hash_code(code: str) -> str:
    """Hash SHA-256 del código para almacenamiento seguro"""
    return hashlib.sha256(code.encode()).hexdigest()


async def verify_email_code(email: str, code: str, db: AsyncSession):
    """Verifica el código de verificación del usuario"""
    user = await get_user_by_email(email, db)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La cuenta ya está verificada"
        )
    
    # Verificar expiración
    if not user.code_expiration or datetime.now(timezone.utc) > user.code_expiration:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El código ha expirado. Solicita uno nuevo"
        )
    
    # Verificar código
    hashed_input = hash_code(code)
    if user.verification_code != hashed_input:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Código de verificación inválido"
        )
    
    # Activar usuario
    user.is_verified = True
    user.is_active = True
    user.verification_code = None
    user.code_expiration = None
    
    await db.commit()
    await db.refresh(user)
    
    return user


async def resend_verification_code(email: str, db: AsyncSession):
    """Regenera y reenvía código de verificación"""
    user = await get_user_by_email(email, db)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La cuenta ya está verificada"
        )
    
    # Generar nuevo código
    new_code = generate_verification_code()
    user.verification_code = hash_code(new_code)
    user.code_expiration = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    await db.commit()
    await db.refresh(user)
    
    return user, new_code



async def create_user(email: str, password: str, db: AsyncSession):
    """
    Crea usuario SOLO con email y password (sin username, first_name, last_name).
    Para el nuevo flujo de registro simplificado.
    """
    if not is_institutional_email(email):
        raise HTTPException(
            status_code=400,
            detail="Solo se permiten correos institucionales para registrarse."
        )

    existing_user = await get_user_by_email(email, db)
    if existing_user:
        raise HTTPException(status_code=409, detail="Ya existe una cuenta con este correo.")

    # Generar código de verificación
    verification_code = generate_verification_code()
    hashed_code = hash_code(verification_code)
    
    # Generar username automático desde el email
    username = email.split("@")[0]
    
    # Verificar si el username generado ya existe
    existing_username = await get_user_by_username(username, db)
    if existing_username:
        # Agregar sufijo numérico si existe
        counter = 1
        while existing_username:
            username = f"{email.split('@')[0]}_{counter}"
            existing_username = await get_user_by_username(username, db)
            counter += 1
    
    user = User(
        username=username,
        first_name="",  # Vacío, puede llenarse después en el perfil
        last_name="",   # Vacío, puede llenarse después en el perfil
        email=email,
        hashed_password=hash_password(password),
        is_active=False,
        is_verified=False,
        verification_code=hashed_code,
        code_expiration=datetime.now(timezone.utc) + timedelta(minutes=15)
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return user, verification_code



async def authenticate_user(identifier: str, password: str, db: AsyncSession):
    """
    Autentica usuario.
    verifica que el usuario esté verificado.
    """
    result = await db.execute(
        select(User).where((User.email == identifier) | (User.username == identifier))
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se encontró usuario con el identificador: {identifier}"
        )

    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas."
        )
    
    # Nueva validación: verificar que el usuario esté verificado
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cuenta no verificada. Por favor verifica tu correo electrónico."
        )

    return user
