# Etapa de build
FROM node:23-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_STATIC_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_STATIC_URL=$NEXT_PUBLIC_STATIC_URL

# 1. Sólo los manifests => capa cacheable
COPY package.json ./  
COPY package-lock.json ./
RUN npm ci --no-audit --progress=false 
# ← más rápido y determinista

# 🔕 Desactivar el telemetry de Next.js
RUN npx next telemetry disable

COPY . .
RUN NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL NEXT_PUBLIC_STATIC_URL=$NEXT_PUBLIC_STATIC_URL npm run build

# Etapa de producción
FROM node:23-alpine
WORKDIR /app

# Solo copia lo esencial
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
