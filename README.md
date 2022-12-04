# PictureApp
App created to share your photos. You can register and upload photos. You can add, edit or delete your comments. You can like other images. Created with React, TailwindCSS, Express.js and MongoDB.

![App Demo](demo/app_demo.gif)

## Setup

### Frontend
Development mode:
```
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Production build:
```
npm run build
http-server --proxy http://localhost:8080? ./build
```

### Backend
```
npm install
```
Create `.env` file:
```
MONGODB=mongodb://localhost:27017/reactdb
PORT=3001
TOKEN_SECRET=secret
```
```
npm start
```