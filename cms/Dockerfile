FROM node:18.15.0-bullseye-slim
# Install dependencies
RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y \
      build-essential \
      gcc autoconf \
      automake \
      zlib1g-dev \
      libpng-dev \
      nasm bash \
      libvips-dev \
    && apt-get clean

WORKDIR /app/
COPY .yarn ./.yarn
COPY package.json .yarnrc.yml yarn.lock ./

WORKDIR /app/cms
COPY ./cms/package.json ./
RUN yarn install

ENV PATH /app/node_modules/.bin:$PATH

COPY ./cms .
RUN chown -R node:node /app/cms
USER node
RUN ["yarn", "build"]
EXPOSE 1337
ENTRYPOINT ["/app/cms/entrypoint.sh"]
