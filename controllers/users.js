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
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }

    return res.send({ data: user }); // Добавлен return
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Неверный формат id пользователя' });
    }
    return res.status(500).send({ message: 'Ошибка на сервере' }); // Добавлен return
  }
};

// Создание пользователя
exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(201).send({ data: user }); // Добавлен return
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
    }
    return res.status(500).send({ message: 'Ошибка на сервере' }); // Добавлен return
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true, context: 'query' },
    );

    if (!updatedUser) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }

    return res.send({ data: updatedUser }); // Добавлен return
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для обновления профиля' });
    }
    return res.status(500).send({ message: 'Ошибка на сервере' }); // Добавлен return
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true, context: 'query' },
    );

    if (!updatedUser) {
      return res.status(404).send({ message: 'Пользователь не найден' });
    }

    return res.send({ data: updatedUser }); // Добавлен return
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для обновления аватара' });
    }
    return res.status(500).send({ message: 'Ошибка на сервере' }); // Добавлен return
  }
};
