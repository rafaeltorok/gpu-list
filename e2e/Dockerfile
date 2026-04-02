FROM cypress/included:13.7.3

WORKDIR /tests
COPY ./package*.json ./
RUN npm install
COPY . .

ENV CYPRESS_FRONTEND=http://gpulist-webapp-client:80
ENV CYPRESS_BACKEND=http://gpulist-webapp-server:3001

CMD ["npm", "run", "cypress:cli"]
