require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { mongoClient } = require('./mongo');

const app = express();

app.get('/', async (req,res) => {
  const db = await mongoClient();
  if (!db) res.status(500).send('Systems Unavailable');

  const { data } = await axios.get('https://goweather.herokuapp.com/weather/california');
  await db.collection('weather').insertOne(data);

  return res.send(data);
});

app.listen(3000);
