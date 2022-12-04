require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const AuthRoutes = require('./routes/auth');
const PostRoutes = require('./routes/post');
const LikeRoutes = require('./routes/like');
const CommentRoutes = require('./routes/comment');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

mongoose.connect(
  process.env.MONGODB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  () => console.log('Connected to DB'),
);

app.use('/api/auth', AuthRoutes);
app.use('/api/post', PostRoutes);
app.use('/api/comment', CommentRoutes);
app.use('/api/like', LikeRoutes);

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`);
});
