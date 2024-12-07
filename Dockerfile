# 기존 Dockerfile
FROM node:22

WORKDIR /usr/src/app

# package.json 및 package-lock.json만 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 나머지 파일 복사
COPY . .

EXPOSE 3000

CMD ["npm", "start"]