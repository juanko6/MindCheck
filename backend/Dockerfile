# ---- backend/Dockerfile --------------------------------
FROM python:3.12-alpine

# Paquetes que suelen requerirse para wheels que necesitan compilarse
RUN apk add --no-cache \
        bash build-base gcc musl-dev libffi-dev postgresql-dev

# Aseguramos que /root/.local/bin (pip --user) se encuentre en el PATH
ENV PATH="/root/.local/bin:${PATH}"

# Directorio de trabajo
WORKDIR /app

# Copiamos los requirements y los instalamos primero (mejor cache)
COPY requirements.txt .

RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# Copiamos el resto del código
COPY . .

# Puerto para Uvicorn
EXPOSE 8000

# Arranque: aplica migraciones **antes** de levantar la API
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
# ---------------------------------------------------------
