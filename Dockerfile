FROM node:22.5.1-bullseye-slim as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM base as frontend-build
WORKDIR /app/client
RUN npm install
RUN npm run build

FROM base as backend-build
RUN npm run build

FROM node:22.5.1-bullseye-slim
WORKDIR /app
COPY --from=backend-build /app/dist ./dist
COPY --from=backend-build /app/package*.json ./
COPY --from=frontend-build /app/client/build ./client/build
RUN npm install --only=production
EXPOSE 3000 5173
CMD ["node", "dist/app.js"]