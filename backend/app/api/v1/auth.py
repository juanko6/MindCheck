from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.auth import UserCreate, UserLogin, Token
from app.core.oauth import create_access_token, get_db
from app.services.auth_service import create_user, authenticate_user

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await create_user(
    username=user_data.username,
    first_name=user_data.first_name,
    last_name=user_data.last_name,
    email=user_data.email,
    password=user_data.password,
    db=db
)
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token}

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    user = await authenticate_user(credentials.identifier, credentials.password, db)
    token = create_access_token(data={"sub": user.email})
    return {"access_token": token}
