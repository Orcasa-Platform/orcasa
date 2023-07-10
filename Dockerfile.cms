FROM node:18-alpine
# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev
ENV NODE_ENV=development

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
CMD ["yarn", "dev"]
