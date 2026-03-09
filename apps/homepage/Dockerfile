FROM node:20-slim
WORKDIR /app

COPY apps/homepage/package.json ./
RUN npm install

COPY apps/homepage/ .

EXPOSE 4321
CMD ["npm", "run", "dev", "--", "--host"]
