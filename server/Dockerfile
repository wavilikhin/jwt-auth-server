FROM node:current-alpine
EXPOSE 3030
WORKDIR /server
COPY package*.json ./
RUN npm install
RUN npm install nodemon
COPY . .