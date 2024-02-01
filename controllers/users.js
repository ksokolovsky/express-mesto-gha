const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');

// Получение всех пользователей
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (error) {
    res.status(500).send({ message: 'Ошибка на сервере' });
  }
};

// Получение пользователя по ИД
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next({ statusCode: 404, message: 'Пользователь не найден' });
    }

    return res.send({ data: user }); // Добавлен return
  } catch (error) {
    if (error.name === 'CastError') {
      return next({ statusCode: 400, message: 'Неверный формат id пользователя' });
    }
    return next(error); // Добавлен return
  }
};

exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next({ statusCode: 404, message: 'Пользователь не найден' }); // Убрано return
        return; // Добавлено для явного выхода из функции
      }
      res.send({ data: user });
    })
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      User.create({
        name: name || 'Жак-Ив Кусто',
        about: about || 'Исследователь',
        avatar: avatar || 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
        email,
        password: hashedPassword,
      })
        .then((user) => {
          res.status(201).send({
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          });
        })
        .catch((error) => {
          console.log(error);
          if (error.code === 11000) {
            next({ statusCode: 409, message: 'Этот email уже зарегистрирован' });
          } else if (error.name === 'ValidationError') {
            next({ statusCode: 400, message: 'Переданы некорректные данные при создании пользователя' });
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

exports.updateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true, context: 'query' },
    );

    if (!updatedUser) {
      next({ statusCode: 404, message: 'Пользователь не найден' });
      return;
    }

    res.send({ data: updatedUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next({ statusCode: 400, message: 'Переданы некорректные данные для обновления профиля' });
    } else {
      next(error);
    }
  }
};

exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true, context: 'query' },
    );

    if (!updatedUser) {
      next({ statusCode: 404, message: 'Пользователь не найден' });
      return;
    }

    res.send({ data: updatedUser });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next({ statusCode: 400, message: 'Переданы некорректные данные для обновления аватара' });
    } else {
      next(error);
    }
  }
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email)) {
    next({ statusCode: 400, message: 'Некорректный формат email' });
    return;
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next({ statusCode: 401, message: 'Неправильные почта или пароль' });
        return;
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next({ statusCode: 401, message: 'Неправильные почта или пароль' });
          }

          const token = jwt.sign(
            { _id: user._id },
            'some-secret-key',
            { expiresIn: '7d' },
          );

          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          });
          res.send({ message: 'Аутентификация прошла успешно' });
        })
        .catch(next);
    })
    .catch(next);
};
