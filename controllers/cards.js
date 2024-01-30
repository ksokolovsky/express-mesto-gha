const Card = require('../models/card');

// Получение всех карточек
exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: 'Ошибка на сервере' }));
};

// Создание новой карточки
exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id; // _id пользователя из временного решения авторизации

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send({ message: 'Ошибка на сервере' });
    });
};

// Удаление карточки
exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  if (!ObjectId.isValid(cardId)) {
    return res.status(400).send({ message: 'Некорректный ID карточки' });
  }

  Card.findByIdAndDelete(cardId)
    .then(card => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
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
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }

      return Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true }
      );
    })
    .then(card => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};

