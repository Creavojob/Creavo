FROM node:18

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

ENV CHOKIDAR_USEPOLLING=true
EXPOSE 3000

CMD ["npm", "start"]
