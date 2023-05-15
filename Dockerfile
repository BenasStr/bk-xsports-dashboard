FROM node:19.5.0-alpine
WORKDIR ./
COPY  package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]