FROM node:20.5-bullseye-slim
RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y libc6  && \
    apt-get clean

WORKDIR /app
COPY .yarn ./.yarn
COPY package.json .yarnrc.yml yarn.lock ./

WORKDIR /app/client
COPY ./client/package.json ./
RUN yarn install

ENV NEXT_TELEMETRY_DISABLED 1

COPY ./client .
RUN chown -R node:node /app/client
USER node

EXPOSE 3000
ENV PORT 3000
ENTRYPOINT ["/app/client/entrypoint.sh"]
