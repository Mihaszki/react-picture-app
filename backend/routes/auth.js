const router = require('express').Router();
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const registerSchema = Joi.object({
  username: Joi.string().min(6).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

router.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const emailExists = await User.findOne({ email: req.body.email });

  if (emailExists) return res.status(400).send({ message: 'Email already exists' });

  const userExists = await User.findOne({ email: req.body.username });

  if (userExists) return res.status(400).send({ message: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res.send({ message: 'Success', data: savedUser });
  }
  catch (err) {
    res.status(400).send({ error: err, message: 'There was an error!' });
  }
});

router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });

  const user = await User.findOne({ username: req.body.username });

  if (!user) return res.status(400).send({ message: 'Username or password is wrong' });

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send({ message: 'Username or password is wrong' });

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.status(200).send({ accessToken: token });
});

module.exports = router;
