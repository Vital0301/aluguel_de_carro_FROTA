FROM node:24-bookworm-slim AS build

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

RUN DB_FROTA="mysql://placeholder:placeholder@localhost:3306/placeholder" \
    npx prisma generate

RUN npm run build && test -f dist/main.js

FROM node:24-bookworm-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build /app ./

ENV NODE_ENV=development
ENV PORT=7542

EXPOSE 3000

CMD ["node", "dist/main.js"]