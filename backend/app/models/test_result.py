from sqlalchemy import Column, Integer, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    test_id = Column(Integer, ForeignKey("tests.id"))
    respuestas = Column(JSON)
    porcentaje = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="results")
    test = relationship("Test", backref="results")
