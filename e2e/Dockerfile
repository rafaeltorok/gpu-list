FROM cypress/included:13.7.3

WORKDIR /e2e

COPY ./e2e/package*.json .
COPY ./e2e .
COPY ./shared ../shared

RUN npm install

ENV CYPRESS_FRONTEND=http://gpulist-webapp-client:80
ENV CYPRESS_BACKEND=http://gpulist-webapp-server:3001

CMD ["npm", "run", "cypress:cli"]
