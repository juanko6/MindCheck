from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.database import Base
from app.models.test import Test  # ✅ aseguramos que Test está definido antes




class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=False)  # False hasta verificar
    is_verified = Column(Boolean, default=False)
    verification_code = Column(String, nullable=True)
    code_expiration = Column(DateTime(timezone=True), nullable=True)
    role = Column(String, default="student")
    tokens = Column(Integer, default=300)
    
    tests = relationship("Test", back_populates="user")
    documents = relationship("Document", back_populates="owner", cascade="all, delete")


