const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb');

// Возможно не пропустит автотест и нужно будет заменить на устаревшие бодиПарсеры.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '65b97395dad914f670fd98b5',
  };

  next();
});

app.use('/users', userRoutes);
app.use('/cards', cardRoutes);

app.get('/', (req, res) => {
  res.send('Привет, мир!');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);