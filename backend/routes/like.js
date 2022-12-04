const router = require('express').Router();
const Post = require('../models/PostModel');
const jwtAuth = require('../middlewares/jwtAuth');

router.delete('/:id', jwtAuth, async (req, res) => {
  /*  const id = req.params.id;
    if (!id) res.status(400).send({ message: 'Invalid id!', success: false });

    try {
      const del = await Comment.deleteOne({ _id: id, 'author.id': req.user });
      const commentsNum = await Comment.countDocuments({ postId: req.body.postId });
      await Post.updateOne({ _id: req.body.postId }, { comments: commentsNum });
      res.status(200).send({ message: 'Success!', success: true, item: del });
    }
    catch (error) {
      res.status(400).send({ error, message: 'There was an error!', success: false });
    }*/
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
