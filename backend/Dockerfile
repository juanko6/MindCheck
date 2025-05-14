# Imagen base de Python
FROM python:3.13-alpine

# Crear y usar el directorio de trabajo
WORKDIR /app

# Copiar los archivos
COPY . .

# Instalar las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Exponer el puerto de Uvicorn
EXPOSE 8000

# Comando de arranque
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
