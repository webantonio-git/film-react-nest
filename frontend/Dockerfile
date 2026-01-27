# --- build stage ---
FROM node:20 AS builder

WORKDIR /app

# Ставим зависимости (если вдруг npm ci снова упадёт, можно fallback на npm install)
COPY package.json package-lock.json ./
RUN npm ci || npm install

# Копируем исходники и собираем фронт
COPY . .
RUN npm run build

# --- runtime stage ---
FROM alpine:3.19 AS runner

WORKDIR /app

# В рантайме нам нужен только билд, без node_modules и исходников
COPY --from=builder /app/dist ./dist

# Этот dist монтируется в nginx через volume
VOLUME ["/app/dist"]

CMD ["sh", "-c", "while true; do sleep 3600; done"]
