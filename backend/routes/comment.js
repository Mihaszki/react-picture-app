const router = require('express').Router();
const Comment = require('../models/CommentModel');
const User = require('../models/UserModel');
const Post = require('../models/PostModel');
const jwtAuth = require('../middlewares/jwtAuth');
const Joi = require('joi');

const commentSchema = Joi.object({
  text: Joi.string().min(6).max(255).required(),
  postId: Joi.string().required(),
});

router.delete('/:id', jwtAuth, async (req, res) => {
  const id = req.params.id;

  if (!id) res.status(400).send({ message: 'Invalid id!', success: false });

  try {
    const del = await Comment.deleteOne({ _id: id, 'author.id': req.user });
    const commentsNum = await Comment.countDocuments({ postId: req.body.postId });
    await Post.updateOne({ _id: req.body.postId }, { comments: commentsNum });
    res.status(200).send({ message: 'Success!', success: true, item: del });
  }
  catch (error) {
    res.status(400).send({ error, message: 'There was an error!', success: false });
  }
});

router.post('/', jwtAuth, async (req, res) => {
  const { error } = commentSchema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message, success: false });

  const getUser = await User.findOne({ _id: req.user._id });
  if (!getUser) return res.status(400).send({ message: 'User does not exists!', success: false });

  const comment = new Comment({
    text: req.body.text,
    postId: req.body.postId,
    author: {
      id: getUser._id,
      username: getUser.username,
    },
  });

  try {
    const saved = await comment.save();
    const commentsNum = await Comment.countDocuments({ postId: req.body.postId });
    await Post.updateOne({ _id: req.body.postId }, { comments: commentsNum });
    res.send({ message: 'Success', success: true, saved });
  }
  catch (err) {
    res.status(400).send({ error: err, success: false, message: 'There was an error!' });
  }
});

router.put('/:id', jwtAuth, async (req, res) => {
  const id = req.params.id;

  if (!id) res.status(400).send({ message: 'Invalid id!', success: false });

  const { error } = commentSchema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message, success: false });

  const getComment = await Comment.findOne({ _id: id });
  if (!getComment) return res.status(400).send({ message: 'Comment does not exists!', success: false });

  try {
    const saved = await Comment.updateOne({ _id: id, 'author.id': req.user._id }, {
      text: req.body.text,
    });
    res.send({ message: 'Success', success: true, saved });
  }
  catch (err) {
    res.status(400).send({ error: err, success: false, message: 'There was an error!' });
  }
});

module.exports = router;
