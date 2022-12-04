const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(401).send({ message: '401' });
      }

      req.user = user;
      next();
    });
  }
  else {
    return res.status(401).send({ message: '401' });
  }
};

module.exports = jwtAuth;