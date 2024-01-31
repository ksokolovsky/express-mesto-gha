const mongoose = require('mongoose');
const Card = require('../models/card');

// Получение всех карточек
exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Создание новой карточки
exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id; // _id пользователя из временного решения авторизации

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return null;
      }
      return res.status(500).send({ message: err.message });
    });
};

// Удаление карточки
exports.deleteCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    res.status(400).send({ message: 'Некорректный ID карточки' });
    return;
  }

  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return null;
      }
      res.send({ data: card });
      return null;
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Поставить лайк карточке
exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Убрать лайк с карточки
exports.dislikeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    res.status(400).send({ message: 'Некорректный ID карточки' });
  }

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      }

      Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      );
    })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
