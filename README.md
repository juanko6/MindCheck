# MindCheck

Transforma tus apuntes en tests. Sube un PDF (o pega un texto), elige las páginas que
te interesan, el modo y la dificultad, y MindCheck genera preguntas con IA para que
practiques. Al terminar ves tu resultado, la explicación de cada respuesta y tu historial.

## Funcionalidades

- Registro con verificación por email (código enviado por SMTP) y login con JWT.
- Registro limitado a correos institucionales: solo se aceptan los dominios de
  `ALLOWED_EMAIL_DOMAINS`.
- Subida y gestión de documentos PDF, con visor y selección de páginas.
- Generación de tests a partir de un PDF o de texto libre, con número de preguntas y
  dificultad configurables.
- Corrección del test, explicación de las respuestas generada con IA e historial de resultados.

## Stack

| Parte | Tecnología |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, react-pdf / pdf.js |
| Backend | FastAPI, SQLAlchemy 2 (async), Alembic, Pydantic |
| Base de datos | PostgreSQL 16 |
| IA | API de OpenAI (modelo configurable con `MODELO_GPT`) |
| Despliegue | Docker Compose |

## Estructura

```
mindcheck/
├── backend/                # API FastAPI
│   ├── app/
│   │   ├── api/v1/         # Rutas: auth, users, documents, tests, testController
│   │   ├── core/           # Hash de contraseñas y OAuth2
│   │   ├── db/             # Conexión y migraciones Alembic
│   │   ├── models/         # Modelos SQLAlchemy
│   │   ├── schemas/        # Esquemas Pydantic
│   │   └── services/       # Lógica: auth, email, PDF, OpenAI, tests
│   └── tests/              # Tests con pytest
├── frontend/               # App Next.js
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── docker-compose.yml
└── .env.example
```

## Puesta en marcha con Docker

Requisitos: Docker y Docker Compose, y una API key de OpenAI.

1. Copia la configuración de ejemplo y rellena los valores:

   ```bash
   cp .env.example .env
   ```

   Como mínimo: `OPENAI_API_KEY`, `POSTGRES_PASSWORD`, `SECRET_KEY`,
   `ALLOWED_EMAIL_DOMAINS` y los datos `MAIL_*` para que lleguen los códigos de verificación. Puedes generar `SECRET_KEY` con
   `openssl rand -hex 32`.

2. Levanta el stack:

   ```bash
   docker compose up -d --build
   ```

   El backend aplica las migraciones de Alembic al arrancar.

3. Abre la app:
   - Frontend: http://localhost:3000
   - API: http://localhost:8000 (documentación interactiva en `/docs`)

`NEXT_PUBLIC_API_URL` se fija al construir la imagen del frontend (`PUBLIC_HOST` +
`API_BASE_PATH`), así que si cambias esos valores tienes que reconstruirla.

## Desarrollo local sin Docker

Necesitas Python 3.12, Node.js 20+ y un PostgreSQL accesible (puedes levantar solo la
base de datos con `docker compose up -d db`).

**Backend**

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

El backend lee el `.env` de la raíz o de `backend/`. Si `DATABASE_URL` apunta al host `db`
y no estás dentro de Docker, las migraciones lo cambian a `localhost` automáticamente.

**Frontend**

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" > .env.local
npm install
npm run dev
```

Next.js lee las variables de `frontend/`, no del `.env` de la raíz, por eso hace falta
el `.env.local` con la URL de la API.

**Tests del backend**

```bash
cd backend
pytest
```

## Variables de entorno

Todas están documentadas en [`.env.example`](.env.example). Las principales:

| Variable | Descripción |
|---|---|
| `OPENAI_API_KEY` | Clave de la API de OpenAI. Obligatoria: el backend no arranca sin ella. |
| `MODELO_GPT` | Modelo usado para generar preguntas y explicaciones. |
| `DATABASE_URL` | Conexión a PostgreSQL con el driver async (`postgresql+asyncpg://…`). |
| `SECRET_KEY` | Secreto para firmar los JWT. |
| `CORS_ORIGINS` | Orígenes permitidos, separados por comas. |
| `ALLOWED_EMAIL_DOMAINS` | Dominios de email permitidos para registrarse, separados por comas. Si está vacía, nadie puede registrarse. |
| `MAIL_*` | Servidor SMTP para enviar los códigos de verificación. |
| `ENVIRONMENT` | En `production` no se sirven los archivos subidos como estáticos. |

Nunca subas el `.env` al repositorio: está en `.gitignore`.

## Licencia

MIT — ver [LICENSE](LICENSE).
