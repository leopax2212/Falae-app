# build
FROM node:18 AS builder
WORKDIR /app

# copia package.json e instala dependências (cache)
COPY package*.json ./
RUN npm ci

# copia tudo e builda
COPY . .
RUN npm run build

# runtime
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# copiar apenas o necessário do builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
