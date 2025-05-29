from app.models.test_result import TestResult
from sqlalchemy.ext.asyncio import AsyncSession

async def submit_test_result(user_id, test_id, respuestas, porcentaje, db: AsyncSession):
    result = TestResult(
        user_id=user_id,
        test_id=test_id,
        respuestas=respuestas,
        porcentaje=porcentaje
    )
    db.add(result)
    await db.commit()
    await db.refresh(result)
    return result
