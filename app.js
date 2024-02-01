const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { registrationSchema, loginSchema } = require('./middlewares/validationSchemas');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', loginSchema, login);
app.post('/signup', registrationSchema, createUser);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден 1' });
});

app.use(errors());

// Вынуждено отключил ошибку линтера здесь, потому что экспресс требует, aaaa
// чтобы next был перечислен, но как его использовать - я не знаю
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

app.listen(PORT);
