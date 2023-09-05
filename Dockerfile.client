FROM node:18-alpine
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
ENV NODE_ENV development

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

CMD ["yarn", "dev"]
