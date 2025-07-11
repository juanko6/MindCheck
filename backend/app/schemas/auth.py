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
