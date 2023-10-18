FROM node:20.8.1-bookworm-slim

ENV OPENAI_Key=
ENV LINE_channelId=
ENV LINE_channelSecret=
ENV LINE_channelAccessToken=

WORKDIR /app

COPY package*.json ./
COPY index.js ./

RUN npm install -g npm@9.6.0
RUN npm install

COPY . .

EXPOSE 3000
CMD [ "node", "index.js" ]