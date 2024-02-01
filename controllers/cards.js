const mongoose = require('mongoose');
const Card = require('../models/card');

// Получаем все карточки
exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (error) {
    next(error);
  }
};

// Создаем новую карточку
exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    res.status(201).send({ data: card });
  } catch (error) {
    if (error.name === 'ValidationError') {
      next({ statusCode: 400, message: 'Переданы некорректные данные для создания карточки' });
    } else {
      next(error);
    }
  }
};

// удаляем карточку, если она наша
exports.deleteCard = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.cardId)) {
      next({ statusCode: 400, message: 'Некорректный ID карточки' });
      return;
    }

    const card = await Card.findById(req.params.cardId);
    if (!card) {
      next({ statusCode: 404, message: 'Карточка не найдена' });
      return;
    }

    if (card.owner.toString() !== req.user._id) {
      next({ statusCode: 403, message: 'Недостаточно прав для выполнения операции' });
      return;
    }

    await card.remove();
    res.send({ message: `Карточка ${card.name} удалена` });
  } catch (error) {
    next(error);
  }
};

// лайкаем карточку
exports.likeCard = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.cardId)) {
      next({ statusCode: 400, message: 'Некорректный ID карточки' });
      return;
    }

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!updatedCard) {
      next({ statusCode: 404, message: 'Карточка не найдена' });
      return;
    }

    res.send({ data: updatedCard });
  } catch (error) {
    next(error);
  }
};

// Убираем лайк с карточки, если он наш
exports.dislikeCard = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.cardId)) {
      next({ statusCode: 400, message: 'Некорректный ID карточки' });
      return;
    }

    const updatedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!updatedCard) {
      next({ statusCode: 404, message: 'Карточка не найдена' });
      return;
    }

    res.send({ data: updatedCard });
  } catch (error) {
    next(error);
  }
};
