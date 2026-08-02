# Se construye desde la carpeta admin-sistema

FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

# Estas variables quedan "horneadas" en el build (Vite las lee en tiempo de build,
# no en tiempo de ejecución) — por eso se pasan como build-args, ver docker-compose.yml
ARG VITE_AUTH_URL
ARG VITE_API_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm run build

FROM nginx:alpine AS final
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
