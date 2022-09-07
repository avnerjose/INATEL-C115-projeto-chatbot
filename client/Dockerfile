FROM node:16-alpine
WORKDIR /usr/src/chatbot-front

ENV PATH /usr/src/chatbot-front/node_modules/.bin:$PATH

COPY package.json /usr/src/chatbot-front/package.json
COPY package-lock.json /usr/src/chatbot-front/package-lock.json
RUN npm install 

COPY . .

EXPOSE 3000

CMD ["npm", "start"]