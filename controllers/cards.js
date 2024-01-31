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
    return; // Завершаем выполнение функции здесь
  }

  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return; // Завершаем выполнение функции здесь
      }
      res.send({ data: card });
      // Не нужно возвращать значение после отправки ответа, просто завершаем функцию
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Поставить лайк карточке
exports.likeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    res.status(400).send({ message: 'Некорректный ID карточки' });
    return;
  }

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }

      Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      )
        .then((updatedCard) => {
          if (!updatedCard) {
            res.status(404).send({ message: 'Карточка не найдена после попытки добавить лайк' });
          } else {
            res.send({ data: updatedCard });
          }
        });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// Убрать лайк с карточки
exports.dislikeCard = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return res.status(400).send({ message: 'Некорректный ID карточки' });
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
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена после попытки удаления лайка' });
      }
      res.send({ data: card });
    })
    .catch((err) =>
      res.status(500).send({ message: err.message }));
};
