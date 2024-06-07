FROM node:18-alpine
LABEL maintainer="Mvoikolesco"

WORKDIR /app

# Copy "package.json" and "package-lock.json" files to install dependencies
COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "dev"]
