const { celebrate, Joi } = require('celebrate');

const registrationSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp('^(https?://)(www.)?([A-Za-z0-9-._~:/?#[]@!$&\'()*+,;=])+(\#)?$')),
  }).unknown(true),
});

const cardIdSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
};

const cardCreateSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
};

module.exports = {
  registrationSchema,
  cardIdSchema,
  cardCreateSchema,
};
