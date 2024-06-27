FROM node:20.15-bullseye-slim

WORKDIR /frontend/react-app

# susumeruディレクトリのdocker-compose.yamlから使用する場合は以下へ変更
# COPY ./frontend/react-app/package.json ./frontend/react-app/package-lock.json ./
COPY ./react-app/package.json ./react-app/package-lock.json ./
RUN npm install
