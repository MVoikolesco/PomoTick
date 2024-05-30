FROM node:18-alpine
LABEL maintainer="Mvoikolesco"

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
