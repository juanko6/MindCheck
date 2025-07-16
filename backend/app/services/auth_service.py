from fastapi import HTTPException, status

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.core.security import hash_password, verify_password
from app.config import ALLOWED_EMAIL_DOMAINS

async def get_user_by_email(email: str, db: AsyncSession):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def get_user_by_username(username: str, db: AsyncSession):
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()


def is_institutional_email(email: str) -> bool:
    domain = email.split("@")[-1].lower()
    return domain in ALLOWED_EMAIL_DOMAINS

async def create_user(username: str, first_name: str, last_name: str, email: str, password: str, db: AsyncSession):
    
    if not is_institutional_email(email):
        raise HTTPException(
            status_code=400,
            detail="Solo se permiten correos institucionales para registrarse."
        )

    existing_user = await get_user_by_email(email, db)
    if existing_user:
        raise HTTPException(status_code=409, detail="Ya existe una cuenta con este correo.")

    existing_username = await get_user_by_username(username, db)
    if existing_username:
        raise HTTPException(status_code=409, detail="Ya existe una cuenta con este nombre de usuario.")

    user = User(
        username=username,
        first_name=first_name,
        last_name=last_name,
        email=email,
        hashed_password=hash_password(password)
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def authenticate_user(identifier: str, password: str, db: AsyncSession):
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

    return user

