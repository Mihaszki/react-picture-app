const router = require('express').Router();
const Post = require('../models/PostModel');
const Comment = require('../models/CommentModel');
const User = require('../models/UserModel');
const jwtAuth = require('../middlewares/jwtAuth');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const postSchema = Joi.object({
  title: Joi.string().min(6).max(500).required(),
  filename: Joi.string(),
  file: Joi.any(),
});

const getUserIdFromJWT = (req) => {
  try {
    const authHeader = req.headers.authorization;
    let user = '';

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.TOKEN_SECRET, (err, id) => {
        if (!err) {
          user = id._id;
        }
      });
    }
    return user;
  }
  catch {
    return '';
  }
};

router.post('/', jwtAuth, async (req, res) => {
  const { error } = postSchema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message, success: false });

  const file = req?.files?.file;

  if (!file || (file?.mimetype !== 'image/png' && file?.mimetype !== 'image/jpeg')) {
    return res.status(400).send({ message: 'Invalid file', success: false });
  }

  const img = 'data:image/png;base64,' + Buffer.from(file.data).toString('base64');

  const getUser = await User.findOne({ _id: req.user._id });
  if (!getUser) return res.status(400).send({ message: 'User does not exists!', success: false });

  const post = new Post({
    filename: req.body.filename,
    title: req.body.title,
    image: img,
    author: {
      id: req.user._id,
      username: getUser.username,
    },
  });

  try {
    const saved = await post.save();
    res.send({ message: 'Success', success: true, saved });
  }
  catch (err) {
    res.status(400).send({ error: err, success: false, message: 'There was an error!' });
  }
});

router.get('/', async (req, res) => {
  const user = getUserIdFromJWT(req);
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).send({ posts, message: 'Success!', success: true, callerId: user });
  }
  catch (err) {
    res.status(400).send({ error: err, message: 'There was an error!', success: false, callerId: user });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) res.status(400).send({ message: 'Post not found!', success: false });

    const user = getUserIdFromJWT(req);

    const comments = await Comment.aggregate([
      { '$match': { postId: req.params.id } },
      { '$sort': { 'createdAt': -1 } },
      {
        '$project': {
          isAuthor: {
            $cond: [
              { $eq: ['$author.id', user] },
              true,
              false,
            ],
          },
          _id: true,
          postId: true,
          title: true,
          text: true,
          'author.id': true,
          createdAt: true,
          updatedAt: true,
          'author.username': true,
        },
      },
    ]);

    res.send({ success: true, message: 'Success', post, comments, callerId: user });
  }
  catch (err) {
    res.status(400).send({ error: err, message: 'There was an error!', success: false });
  }
});

module.exports = router;
