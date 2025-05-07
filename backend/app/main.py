from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routes import pdf_routes

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://mi-frontend.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Registrar rutas
app.include_router(pdf_routes.router)

@app.get("/")
async def root():
    return {"message": "Servidor funcionando 🚀"}
