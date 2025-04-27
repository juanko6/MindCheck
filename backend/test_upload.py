import requests

# Ruta al PDF de prueba que quieras usar
pdf_path = "C:\\Users\\juank\\Desktop\\CV-IngenieroInformatico-JuanGutierrez.pdf"

# Endpoint del backend
url = "http://localhost:8000/upload-pdf"

# Cargar el PDF
with open(pdf_path, "rb") as pdf_file:
    files = {'file': ("ejemplo.pdf", pdf_file, "application/pdf")}
    response = requests.post(url, files=files)

# Ver la respuesta
if response.status_code == 200:
    data = response.json()
    print("✅ Preguntas generadas:")
    print(data)
else:
    print(f"❌ Error {response.status_code}: {response.text}")
