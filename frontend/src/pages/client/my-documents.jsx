// pages/client/my-documents.jsx
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listUserDocuments, deleteDocument } from "@/services/documentService";
import DocumentCard from "@/components/common/DocumentCard";
import { useTheme } from "@/context/ThemeContext";

export default function MyDocumentsPage() {
  const { token, loading } = useAuth();
  const [documents, setDocuments] = useState([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    if (token) {
      listUserDocuments(token)
        .then(setDocuments)
        .catch(console.error);
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este documento?")) return;
    try {
      await deleteDocument(id, token);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      alert("Error al eliminar el documento");
    }
  };

  const handleView = async (doc) => {
  try {
    const res = await fetch(doc.url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("No autorizado");

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  } catch (error) {
    alert("No se pudo abrir el documento.");
    console.error(error);
  }
};

  if (loading) return <p>Cargando...</p>;

  return (
        <div
      className={`min-h-screen p-6 transition-colors duration-500 ${
        darkMode ? "bg-[#0B1120] text-white" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">Mis Documentos</h1>
      {documents.length === 0 ? (
        <p>No has subido ningún documento.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} onView={handleView} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
