from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession

async def descontar_tokens_usuario(db: AsyncSession, user: User, cantidad: int):
    user.tokens -= cantidad
    await db.commit()
    await db.refresh(user)
