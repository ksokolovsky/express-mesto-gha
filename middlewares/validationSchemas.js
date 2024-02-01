const { celebrate, Joi } = require('celebrate');

const registrationSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp('^(https?:\/\/)(www\.)?([A-Za-z0-9-._~:/?#[\\]@!$&\'()*+,;=]+)(#)?$')),
  }).unknown(true),
});

const loginSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const cardIdSchema = {
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
};

const cardCreateSchema = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp('^(https?:\/\/)(www\.)?([A-Za-z0-9-._~:/?#[\\]@!$&\'()*+,;=]+)(#)?$')),
  }),
};

const updateProfileSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const updateAvatarSchema = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp('^(https?:\/\/)(www\.)?([A-Za-z0-9-._~:/?#[\\]@!$&\'()*+,;=]+)(#)?$')),
  }),
});

module.exports = {
  updateProfileSchema,
  updateAvatarSchema,
  registrationSchema,
  cardIdSchema,
  cardCreateSchema,
  loginSchema,
};
