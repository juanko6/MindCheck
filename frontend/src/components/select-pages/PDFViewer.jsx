import { Document, Page } from 'react-pdf';

export default function PDFViewer({
  pdfUrl,
  numPages,
  onLoadSuccess,
  selectedPages,
  togglePageSelection,
  handleSelectAll,
  allSelected,
  zoom,
}) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-2 px-2">
        <span className="text-sm font-medium">
          {selectedPages.length} página{selectedPages.length !== 1 ? 's' : ''} seleccionada{selectedPages.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={handleSelectAll}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {allSelected ? 'Deseleccionar todas' : 'Seleccionar todas'}
        </button>
      </div>

      <div className="overflow-x-auto w-full px-2 bg-white dark:bg-gray-800 rounded-lg shadow-inner border border-gray-300 dark:border-gray-700">

        <Document
          file={`${process.env.NEXT_PUBLIC_API_URL}${pdfUrl}`}
          onLoadSuccess={onLoadSuccess}
        >
          <div className="flex gap-4 py-4 w-fit">
            {Array.from({ length: numPages }, (_, index) => {
              const pageNum = index + 1;
              const isSelected = selectedPages.includes(pageNum);
              return (
                <div
                  key={pageNum}
                  onClick={() => togglePageSelection(pageNum)}
                  className={`flex flex-col items-center min-w-[120px] cursor-pointer transform transition
                    ${isSelected ? "border-4 border-green-500 shadow-xl" : "border border-transparent"}
                    hover:scale-105`}
                >
                  <Page
                    pageNumber={pageNum}
                    width={zoom}
                    className="rounded"
                  />
                </div>
              );
            })}
          </div>
        </Document>
      </div>
    </div>
  );
}
