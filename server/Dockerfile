FROM node:10

WORKDIR /home/node/app/server

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 4000

CMD ["npm", "start"] 
