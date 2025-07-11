from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: EmailStr
    role: str
    tokens: int
