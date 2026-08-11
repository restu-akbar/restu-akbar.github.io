FROM node:22-alpine
ENV NODE_ENV development

WORKDIR /app

RUN apk add --no-cache git openssh-client

COPY package.json .
COPY yarn.lock .

RUN corepack enable && yarn install

COPY . .

EXPOSE 3000
CMD ["yarn", "start"]
