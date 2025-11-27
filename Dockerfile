FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ls -lisa

FROM node:20-alpine AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /usr/src/app/dist ./
COPY --from=builder /usr/src/app/views ./views
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/migrations ./migrations
COPY --from=builder /usr/src/app/storage ./storage
COPY --from=builder /usr/src/app/.env.production ./.env
EXPOSE 3000
CMD ["npm", "start"]