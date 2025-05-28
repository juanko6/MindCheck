from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# TODO: debe ir en variables de entorno 
DATABASE_URL = "postgresql+asyncpg://mindcheck_user:4l1c4nt3@localhost:5432/mindcheck"

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()