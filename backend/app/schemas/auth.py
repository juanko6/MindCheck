#app/schema/auth.py
from pydantic import BaseModel, EmailStr, constr, field_validator
from typing import Annotated

# Reglas para la contraseña: mínimo 8 caracteres, una mayúscula, un número y un carácter especial
password_regex = r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"

class UserCreate(BaseModel):
    username: Annotated[str, constr(strip_whitespace=True, min_length=3)]
    first_name: Annotated[str, constr(strip_whitespace=True, min_length=1)]
    last_name: Annotated[str, constr(strip_whitespace=True, min_length=1)]
    email: EmailStr
    password: Annotated[str, constr(min_length=8, pattern=password_regex)]

    @field_validator("username", "first_name", "last_name")
    @classmethod
    def no_empty_strings(cls, v):
        if not v.strip():
            raise ValueError("Este campo no puede estar vacío.")
        return v


class UserLogin(BaseModel):
    identifier: str  # Puede ser email o username
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ============ NUEVOS SCHEMAS PARA VERIFICACIÓN ============

class UserRegister(BaseModel):
    """Schema para registro simplificado solo con email y password"""
    email: EmailStr
    password: Annotated[str, constr(min_length=8, pattern=password_regex)]

class VerifyEmailRequest(BaseModel):
    """Schema para verificar código de email"""
    email: EmailStr
    code: str  # ✅ Sin validador por ahora para debug
    
    # ✅ Validación manual más flexible
    @field_validator("code")
    @classmethod
    def validate_code(cls, v):
        # Limpiar espacios
        v = v.strip()
        
        # Verificar que sea numérico
        if not v.isdigit():
            raise ValueError("El código debe contener solo números")
        
        # Verificar longitud
        if len(v) != 6:
            raise ValueError(f"El código debe tener 6 dígitos, recibido: {len(v)}")
        
        return v

class ResendCodeRequest(BaseModel):
    """Schema para reenviar código de verificación"""
    email: EmailStr


class RegisterResponse(BaseModel):
    """Schema para respuesta de registro"""
    message: str
    email: str


class MessageResponse(BaseModel):
    """Schema genérico para mensajes de respuesta"""
    message: str