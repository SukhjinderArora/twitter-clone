FROM node:16

RUN npm i -g nodemon

USER node

RUN mkdir /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package.json .

RUN npm install

COPY --chown=node:node . .

RUN npx prisma generate

EXPOSE 5000

CMD [ "nodemon", "index.js" ]