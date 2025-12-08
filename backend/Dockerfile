FROM node:18

WORKDIR /usr/src/app

# Copy package manifests first to leverage layer caching
COPY package.json package-lock.json* ./

RUN npm install --production

# Copy source
COPY . .

EXPOSE 5001

ENV NODE_ENV=production

CMD ["npm", "start"]
