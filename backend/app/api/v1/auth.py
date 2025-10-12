from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.auth import UserCreate, UserLogin, Token, UserRegister, VerifyEmailRequest, ResendCodeRequest, RegisterResponse, MessageResponse
from app.core.oauth import create_access_token, get_db
from fastapi.exceptions import RequestValidationError
from app.services.auth_service import create_user, verify_email_code, resend_verification_code, authenticate_user
from app.services.email_service import send_verification_email


router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """
    Login con email o username.
    Solo permite acceso a usuarios verificados.
    """
    try:
        user = await authenticate_user(credentials.identifier, credentials.password, db)
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register_simple(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    """
    Registro simplificado solo con email y password.
    Genera username automáticamente y requiere verificación.
    """
    try:
        user, verification_code = await create_user(
            email=user_data.email,
            password=user_data.password,
            db=db
        )
        
        # Enviar email con código de verificación
        await send_verification_email(user.email, verification_code)
        
        return {
            "message": "Usuario registrado. Revisa tu email para el código de verificación",
            "email": user.email
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/verify-email", response_model=Token)
async def verify_email_endpoint(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Verifica el código de email y activa la cuenta.
    """
    try:
        # Parsear body manualmente primero para debug
        body = await request.json()
        print(f"\n{'='*50}")
        print(f"🔍 RAW REQUEST BODY:")
        print(f"   {body}")
        print(f"{'='*50}\n")
        
        # Validar con Pydantic
        data = VerifyEmailRequest(**body)
        
        print(f"✅ Validación Pydantic exitosa")
        print(f"   Email: {data.email}")
        print(f"   Código: {data.code}")
        
        user = await verify_email_code(data.email, data.code, db)
        access_token = create_access_token(data={"sub": user.email})
        
        return Token(access_token=access_token, token_type="bearer")
        
    except RequestValidationError as ve:
        print(f"\n❌ ERROR DE VALIDACIÓN PYDANTIC:")
        print(f"   {ve.errors()}")
        print(f"{'='*50}\n")
        raise HTTPException(
            status_code=422,
            detail=f"Error de validación: {ve.errors()}"
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"\n❌ ERROR INESPERADO:")
        print(f"   Tipo: {type(e).__name__}")
        print(f"   Mensaje: {str(e)}")
        print(f"{'='*50}\n")
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/resend-code", response_model=MessageResponse)
async def resend_code(data: ResendCodeRequest, db: AsyncSession = Depends(get_db)):
    """
    Reenvía código de verificación al email del usuario.
    """
    try:
        user, new_code = await resend_verification_code(data.email, db)
        await send_verification_email(user.email, new_code)
        return {"message": "Código de verificación reenviado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
