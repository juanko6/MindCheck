// pages/client/my-documents.jsx
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { listUserDocuments, deleteDocument } from "@/services/documentService";
import DocumentCard from "@/components/common/DocumentCard";

export default function MyDocumentsPage() {
  const { token, loading } = useAuth();
  const [documents, setDocuments] = useState([]);

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

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mis Documentos</h1>
      {documents.length === 0 ? (
        <p>No has subido ningún documento.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} onView={(url) => window.open(url, "_blank")} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
