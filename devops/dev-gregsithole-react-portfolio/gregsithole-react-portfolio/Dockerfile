FROM node:22-alpine
ENV NODE_ENV development

WORKDIR /app

#salin file dependency dari root context
COPY package.json .
COPY yarn.lock .

RUN corepack enable && yarn install

# salin source lain
COPY . .

EXPOSE 3000
CMD ["yarn", "start"]
