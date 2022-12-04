const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  postId: {
    type: String,
    required: true,
  },
  author: {
    id: { type: String, required: true },
    username: { type: String, required: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
