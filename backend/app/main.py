import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routes import pdf_routes

app = FastAPI()

# Crear carpeta uploads si no existe
upload_dir = "uploads"
if not os.path.exists(upload_dir):
    os.makedirs(upload_dir)

# Montar carpeta uploads para servir archivos estáticos
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


origins = [
    "http://168.75.106.115:3000",
    "http://localhost:3000",  # opcional, para desarrollo local
]

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Registrar rutas
app.include_router(pdf_routes.router)

@app.get("/")
async def root():
    return {"message": "Servidor funcionando 🚀"}
