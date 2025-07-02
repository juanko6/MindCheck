from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Test(Base):
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    dificultad = Column(String(50))
    data = Column(JSON)  # data del test completo (preguntas, opciones, respuestas)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="tests")
