FROM node:20.10-bookworm-slim
RUN apt-get update -y && \
    apt-get upgrade -y && \
    apt-get install -y libc6  && \
    apt-get clean

ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

COPY .yarn ./.yarn
COPY public ./public
COPY src ./src

COPY .browserlistrc \
     .yarnrc.yml \
     components.json \
     entrypoint.sh \
     index.js \
     logger.js \
     next.config.mjs \
     package.json \
     postcss.config.js \
     README.md \
     tailwind.config.js \
     tsconfig.json \
     yarn.lock \
     .env.local \
     ./

RUN yarn install

EXPOSE 3000
ENV PORT 3000

ENTRYPOINT ["/app/entrypoint.sh"]
