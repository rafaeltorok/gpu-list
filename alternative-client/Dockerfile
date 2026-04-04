# Build stage
FROM node:20-alpine AS build

WORKDIR /app/alt-client

COPY ./alternative-client .

RUN npm install
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY ./alternative-client/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static build
COPY --from=build /app/alt-client/dist /usr/share/nginx/html/alt

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
