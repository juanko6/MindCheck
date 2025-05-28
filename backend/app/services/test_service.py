from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import Test

# Crear test asociado a un usuario
async def create_test(user_id: int, title: str, db: AsyncSession):
    new_test = Test(user_id=user_id, title=title)
    db.add(new_test)
    await db.commit()
    await db.refresh(new_test)
    return new_test

# Obtener todos los tests de un usuario
async def get_user_tests(user_id: int, db: AsyncSession):
    result = await db.execute(select(Test).where(Test.user_id == user_id))
    return result.scalars().all()
