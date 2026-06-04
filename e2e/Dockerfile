FROM cypress/included:13.7.3

WORKDIR /e2e

COPY ./e2e/package*.json .
COPY ./e2e .
COPY ./shared ../shared

RUN npm ci

ENV CYPRESS_FRONTEND=http://nginx:80
ENV CYPRESS_BACKEND=http://nginx:80

CMD ["npx", "cypress", "run"]
