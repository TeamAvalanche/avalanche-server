'use strict';

const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const request = require('request');
// const rp = require('request-promise');

const app = express();
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/avalanche';
const client = new pg.Client(DATABASE_URL);
client.connect();

client.on('error', err => {
  console.error(err);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/api/v1/feedback', (req, res) => {
  console.log('request = ', req);
  client.query('SELECT * FROM feedback;')
    .then(result => {
      console.log(result);
      res.send(result.rows);
    }).catch(err => {
      console.error(err);
    });
});

app.post('/api/v1/feedback', (req, res) => {
  client.query(`
  INSERT INTO feedback (name, email, location, comments, rating)
  VALUES($1, $2, $3, $4, $5);
  `,
    [
      req.body.name,
      req.body.email,
      req.body.location,
      req.body.comments,
      req.body.rating
    ]
  ).then(() => res.send('inserted successfully'))
  .catch(err => console.error(err));
});

// var options = {
//   url: 'http://www.nwac.us/api/v2/avalanche-forecast/?format=json&day1_date=2018-01-16',
//   json: true
// };

// rp(options)
//   .then(function (locations) {
//     console.log('locations', locations.objects[0].avalanche_region_forecast[0].bottom_line_summary);
//   })
//   .catch(function (err) {
//     console.error('error', err);
//   });

app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});

app.get('/test', (req, res) => res.send());