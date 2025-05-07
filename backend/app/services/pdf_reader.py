# backend/app/services/pdf_reader.py


import pdfplumber

async def extract_text_from_pdf(file, paginas: str):
    """
    Extrae el texto solo de las páginas seleccionadas de un archivo PDF.

    :param file: Archivo subido (UploadFile).
    :param paginas: String con formato tipo '1,3,5-7'
    :return: Texto concatenado de las páginas seleccionadas
    """
    # Convertir el string de páginas a una lista de índices (basado en 0)
    pages_to_extract = set()

    for part in paginas.split(","):
        if "-" in part:
            inicio, fin = map(int, part.split("-"))
            pages_to_extract.update(range(inicio - 1, fin))  # pdfplumber usa 0-index
        else:
            pages_to_extract.add(int(part) - 1)

    text = ""
    with pdfplumber.open(file.file) as pdf:
        for i in sorted(pages_to_extract):
            if 0 <= i < len(pdf.pages):
                page = pdf.pages[i]
                text += page.extract_text() or ""

    return text
