import os
from datetime import datetime
from dotenv import load_dotenv
from fastapi import APIRouter, Request, UploadFile, File, Depends, HTTPException
from fastapi.responses import FileResponse
from httpcore import request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.oauth import get_current_user, get_db
from app.models.user import User
from app.models.document import Document

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])
load_dotenv()

@router.post("/upload", response_model=dict)
async def upload_document(
    request: Request,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
    
):
    user_dir = os.path.join("uploads", str(current_user.id))
    os.makedirs(user_dir, exist_ok=True)

    file_path = os.path.join(user_dir, file.filename)
    with open(file_path, "wb+") as f:
        f.write(await file.read())

    db_doc = Document(
        filename=file.filename,
        path=file_path,
        owner_id=current_user.id,
        uploaded_at=datetime.utcnow()
    )
    db.add(db_doc)
    await db.commit()
    await db.refresh(db_doc)

    # ✅ Forzar HTTPS si estás en producción
    raw_base_url = str(request.base_url).rstrip("/")
    if os.getenv("ENVIRONMENT") == "production" and raw_base_url.startswith("http://"):
        raw_base_url = raw_base_url.replace("http://", "https://")

    file_url = f"{raw_base_url}/api/v1/documents/view/{current_user.id}/{file.filename.replace(' ', '%20')}"


    return {
        "message": "Documento subido correctamente",
        "document_id": db_doc.id,
        "filename": db_doc.filename,
        "fileUrl":  file_url,
        "path": db_doc.path

    }


@router.get("/list")
async def list_user_documents(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Document).where(Document.owner_id == current_user.id)
    )
    documents = result.scalars().all()
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "url": f"/api/v1/documents/view/{current_user.id}/{doc.filename}",
            "uploaded_at": doc.uploaded_at
        }
        for doc in documents
    ]


@router.get("/view/{user_id}/{filename}")
async def view_document(
    user_id: int,
    filename: str,
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="No autorizado para acceder al archivo")

    file_path = os.path.join("uploads", str(user_id), filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    return FileResponse(file_path, media_type="application/pdf", filename=filename)


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    doc = await db.get(Document, document_id)
    if not doc or doc.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Documento no encontrado o no autorizado")

    try:
        os.remove(doc.path)
    except FileNotFoundError:
        pass

    await db.delete(doc)
    await db.commit()
    return {"message": "Documento eliminado"}

