export default function PageSelectionFooter({ onCancel, onContinue }) {
  return (
    <div className="flex gap-4 mt-8">
      <button
        onClick={onCancel}
        className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-700 transition font-semibold"
      >
        Atras
      </button>

      <button
        onClick={onContinue}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition font-semibold"
      >
        Continuar al Test ➡️
      </button>
    </div>
  );
}
