// services/documentService.js
import { API_BASE } from "./config";

const DOC_API = `${API_BASE}/documents`;

export async function listUserDocuments(token) {
  const res = await fetch(`${DOC_API}/list`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al listar documentos");
  return res.json(); // [{ id, filename, url, uploaded_at }]
}

export async function deleteDocument(documentId, token) {
  const res = await fetch(`${DOC_API}/${documentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al eliminar documento");
  return res.json(); // { message: ... }
}
