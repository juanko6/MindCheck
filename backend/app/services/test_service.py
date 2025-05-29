from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import Test

# Crear test asociado a un usuario
async def create_test(user_id: int, title: str, data: dict, db: AsyncSession):
    new_test = Test(user_id=user_id, title=title, data=data)
    db.add(new_test)
    await db.commit()
    await db.refresh(new_test)
    return new_test

async def get_test_by_id(test_id: int, db: AsyncSession):
    result = await db.execute(select(Test).where(Test.id == test_id))
    return result.scalar_one_or_none()


async def get_user_tests(user_id: int, db: AsyncSession):
    result = await db.execute(select(Test).where(Test.user_id == user_id))
    return result.scalars().all()