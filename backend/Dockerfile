FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x src/models/*

EXPOSE 3000

CMD ["npm", "start"] 