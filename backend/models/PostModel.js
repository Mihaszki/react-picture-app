const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 6,
    max: 500,
  },
  filename: {
    type: String,
    required: true,
    default: 'file.png',
  },
  author: {
    id: { type: String, required: true },
    username: { type: String, required: true },
  },
  image: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
  likesUsers: {
    type: [],
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
