require('dotenv').config();
const bodyParser = require('body-parser')
const express = require('express');
const axios = require('axios');
const { uuid } = require('uuidv4');
const { mongoClient } = require('../mongo');
// const products = require('./products.json');
const products = require('../test_products.json');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/api', async (req,res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send('Systems Unavailable');

  const { data } = await axios.get('https://goweather.herokuapp.com/weather/california');
  await db.collection('weather').insertOne(data);

  return res.send(data);
});

app.get('/api/products', async (req,res) => {
  return res.json(products);
});

app.post('/api/orders', async (req,res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send('Systems Unavailable');

  const newOrder = {
    name: req.body.name,
    price: req.body.price,
    quantity: 1,
    id: uuid(),
  };
  await db.collection('orders').insertOne(newOrder);

  return res.send(newOrder);
});

app.get('/api/products/:id', async (req,res) => {
  const product = products.filter(({ id }) => req.params.id === id);
  return res.json(product.length ? product.shift() : product);
});

app.listen(3000);
