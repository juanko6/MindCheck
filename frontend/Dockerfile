# Etapa de build
FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install


# 🔕 Desactivar el telemetry de Next.js
RUN npx next telemetry disable

COPY . .
RUN npm run build

# Etapa de producción
FROM node:23-alpine

WORKDIR /app

# Solo copia lo esencial
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
