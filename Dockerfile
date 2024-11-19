# 베이스 이미지
FROM node:20-alpine

# 작업 디렉토리 생성
WORKDIR /usr/src/app

# 의존성 설치
COPY package*.json ./
RUN npm ci

# 애플리케이션 소스 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행
# CMD [ "npm", "run", "start:dev" ]