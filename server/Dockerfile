FROM node:16

WORKDIR /usr/src/app/server/
COPY . .

RUN npm install

EXPOSE 3000
CMD [ "npm", "run", "serve" ]