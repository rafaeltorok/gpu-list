# Main client
FROM node:20-alpine as build-main

WORKDIR /usr/src/app/client

COPY ./client/package.*json .
COPY ./client .
COPY ./shared ../shared

# Install dependencies
RUN npm ci
RUN npm run build


# Alt client
FROM node:20-alpine AS build-alt

WORKDIR /usr/src/app/alt-client

COPY ./alternative-client/package.*json .
COPY ./alternative-client .

# Install dependencies
RUN npm ci
RUN npm run build


# Production stage
FROM nginx:stable-alpine AS production

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy the Nginx custom config file
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the main client static build
COPY --from=build-main /usr/src/app/client/dist /usr/share/nginx/html/

# Copy the alt client static build
COPY --from=build-alt /usr/src/app/alt-client/dist /usr/share/nginx/html/alt/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
