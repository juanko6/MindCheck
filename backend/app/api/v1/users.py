from fastapi import APIRouter, Depends
from app.core.oauth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/v1/users", tags=["users"])

@router.get("/me", response_model=dict)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role
    }
