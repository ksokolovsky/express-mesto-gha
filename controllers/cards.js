const mongoose = require('mongoose');
const Card = require('../models/card');

// Получаем все карточки
exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (error) {
    res.status(500).send({ message: 'Ошибка на сервере' });
  }
};

// Создаем новую карточку
exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const card = await Card.create({ name, link, owner });
    return res.status(201).send({ data: card });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для создания карточки' });
    }
    return res.status(500).send({ message: 'Ошибка на сервере' });
  }
};

// удаляем карточку, если она наша
exports.deleteCard = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.cardId)) {
      return res.status(400).send({ message: 'Некорректный ID карточки' });
    }

    const card = await Card.findByIdAndDelete(req.params.cardId);

    if (!card) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    return res.send({ message: `Карточка ${card.name} удалена` }); // Добавлен return
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на сервере' }); // Добавлен return
  }
};

// лайкаем карточку
exports.likeCard = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.cardId)) {
      return res.status(400).send({ message: 'Некорректный ID карточки' });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    return res.send({ data: updatedCard });
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на сервере' });
  }
};

// Убираем лайк с карточки, если он наш
exports.dislikeCard = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.cardId)) {
      return res.status(400).send({ message: 'Некорректный ID карточки' });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).send({ message: 'Карточка не найдена' });
    }

    return res.send({ data: updatedCard });
  } catch (error) {
    return res.status(500).send({ message: 'Ошибка на сервере' });
  }
};
