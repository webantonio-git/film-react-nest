FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM alpine:3.19 AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist

VOLUME ["/app/dist"]

CMD ["sh", "-c", "while true; do sleep 3600; done"]
