# Multi-stage build for Node.js services

# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build dependencies
FROM node:18-alpine AS build-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 3: Backend build
FROM build-deps AS backend-build
WORKDIR /app
COPY . .
RUN npm run build:backend

# Stage 4: Backend runtime
FROM node:18-alpine AS backend
WORKDIR /app
RUN apk add --no-cache dumb-init
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=backend-build /app/backend ./backend
COPY package*.json ./
EXPOSE 5000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "backend/dist/server.js"]

# Stage 5: Frontend build
FROM build-deps AS frontend-build
WORKDIR /app
COPY . .
RUN npm run build:frontend

# Stage 6: Frontend runtime (nginx)
FROM nginx:alpine AS frontend
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

# Stage 7: Extension build
FROM build-deps AS extension-build
WORKDIR /app
COPY . .
RUN npm run build:extension

# Stage 8: Extension output
FROM scratch AS extension
COPY --from=extension-build /app/extension/dist /dist
