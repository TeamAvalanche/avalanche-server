'use strict';

const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const superagent = require('superagent');
const request = require('request');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

// const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/avalanche'; // arthur
//const DATABASE_URL = process.env.DATABASE_URL || 'postgres://amgranad:amber123@localhost:5432/avalanche'; //amber
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://alicialycan:534@localhost:5432/avalanche'; //alicia

const client = new pg.Client(DATABASE_URL);
client.connect();

client.on('error', err => {
  console.error(err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(express.static('./public'));

app.get('/nwac/:region', (req, res) => {
  const url = `http://www.nwac.us/api/v2/avalanche-region-forecast/?format=json&zone=${req.params.region}`;
  superagent.get(url)
    .then(info => res.send(info.text))
    .catch(err => console.error(err));
});

app.get('/scrape/:region', (req, res) => {

  const region = req.params.region;
  const regionUrls = {
    'cascade-west-north-baker':'https://weather.com/weather/today/l/266:11:US',
    'cascade-west-stevens-pass': 'https://weather.com/weather/today/l/427:11:US',
    'cascade-west-snoqualmie-pass': 'https://weather.com/weather/today/l/USWA0413:1:US',
    'cascade-west-south': 'https://weather.com/weather/today/l/124:11:US'
  };

  const url = regionUrls[region];

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      var temp1 = $('.today_nowcard-phrase').html();
      var temp2 = $('.today_nowcard-temp span').text();
      var temps = [temp1, temp2];
    }
    res.send(temps);
  });
});

app.get('/api/v1/feedback', (req, res) => {
  client.query('SELECT * FROM feedback;')
    .then(result => {
      res.send(result.rows);
    }).catch(err => {
      console.error(err);
    });
});

app.get('/api/v1/feedback/:id', (req, res) => {
  client.query(`
    SELECT * FROM feedback WHERE feedback_id=$1;
  `, [req.params.id]).then(result => res.send(result.rows[0]))
    .catch(err => console.error(err));
});

app.get('/api/v1/feedbackids', (req, res) => {
  client.query(`
    SELECT feedback_id FROM feedback;
  `).then(result => res.send(result.rows))
    .catch(err => console.error(err));
});

app.post('/api/v1/feedback', (req, res) => {
  client.query(`
  INSERT INTO feedback (name, email, location, comments, rating)
  VALUES($1, $2, $3, $4, $5);
  `, [
      req.body.name,
      req.body.email,
      req.body.location,
      req.body.comments,
      req.body.rating
    ]).then(() => res.send('inserted successfully'))
    .catch(err => console.error(err));
});

app.delete('/api/v1/feedback/:id', (req, res) => {
  client.query(`
  DELETE FROM feedback WHERE feedback_id=$1;  
  `, [req.params.id]).then(result => res.status(204).send(result))
    .catch(err => console.error(err));
});

app.put('/api/v1/feedback/:name', (req, res) => {
  client.query(`
  UPDATE feedback
  SET email='${req.body.email}', location='${req.body.location}', comments='${req.body.comments}', rating=${req.body.rating}
  WHERE name='${req.body.name}';
  `).then(() => {
    res.send('updated successfully');
  })
    .catch(err => console.error(err));
});

app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});