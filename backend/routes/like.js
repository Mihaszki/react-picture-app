const router = require('express').Router();
const Post = require('../models/PostModel');
const jwtAuth = require('../middlewares/jwtAuth');

router.delete('/', jwtAuth, async (req, res) => {
  const findPost = await Post.findOne({ _id: req.body.postId });
  if (!findPost?.likesUsers.includes(req.user._id)) {
    return res.status(400).send({ message: 'Not liked!', success: false });
  }

  const likeNum = findPost.likes;

  try {
    await Post.updateOne({ _id: req.body.postId },
      { $pull: { likesUsers: req.user._id } });
    await Post.updateOne({ _id: req.body.postId }, { likes: likeNum - 1 });
    res.send({ message: 'Success', success: true });
  }
  catch (err) {
    res.status(400).send({ error: err, success: false, message: 'There was an error!' });
  }
});

router.post('/', jwtAuth, async (req, res) => {
  const findPost = await Post.findOne({ _id: req.body.postId });
  if (findPost?.likesUsers.includes(req.user._id)) {
    return res.status(400).send({ message: 'Liked twice!', success: false });
  }
  else if (findPost.author.id === req.user._id) {
    return res.status(400).send({ message: 'Liked own post!', success: false });
  }

  const likeNum = findPost.likes;

  try {
    await Post.updateOne({ _id: req.body.postId },
      { $push: { likesUsers: req.user._id } });
    await Post.updateOne({ _id: req.body.postId }, { likes: likeNum + 1 });
    res.send({ message: 'Success', success: true });
  }
  catch (err) {
    res.status(400).send({ error: err, success: false, message: 'There was an error!' });
  }
});

module.exports = router;
