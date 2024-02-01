const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next({ statusCode: 401, message: 'Необходима авторизация' });
    return;
  }

  const token = authorization.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, 'secret-key');
    req.user = payload;
    next();
  } catch (err) {
    next({ statusCode: 401, message: 'Необходима авторизация' });
  }
};
