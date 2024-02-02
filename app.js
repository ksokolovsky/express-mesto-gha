const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser'); // cookie
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { registrationSchema, loginSchema } = require('./middlewares/validationSchemas');
const NotFoundError = require('./errors/not-found');

const app = express();
const PORT = 3000;

// mongoose.connect('mongodb://localhost:27017/mestodb'); тестирую ошибку при запуске сервера
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', { useNewUrlParser: true, useUnifiedTopology: true });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post('/signin', loginSchema, login);
app.post('/signup', registrationSchema, createUser);

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardRoutes);

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден. Неизвестный маршрут'));
});

app.use(errors());

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT);
