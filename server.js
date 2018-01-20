'use strict';

const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const superagent = require('superagent');

const app = express();
const NWAC_URL = 'http://www.nwac.us/api/v2';
const PORT = process.env.PORT || 3000;

// const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/avalanche'; // arthur
// const DATABASE_URL = process.env.DATABASE_URL || 'postgres://amgranad:amber123@localhost:5432/avalanche'; //amber

// const client = new pg.Client(DATABASE_URL);
// client.connect();

// client.on('error', err => {
//   console.error(err);
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use(express.static('./public'));

// app.get('/forecasts/:zone', (req, res) => {
//   const url = NWAC_URL + '/avalanche-region-forecast/?format=json&zone=' + req.params.zone;
// app.use(express.static('./public'));

app.get('/nwac/:region', (req, res) => {
  console.log('routing an nwac ajax request for ', req.params.region);
  const url = `http://www.nwac.us/api/v2/avalanche-region-forecast/?format=json&zone=${req.params.region}`;
  superagent.get(url)
    .then(info => res.send(info.text))
    .catch(err => console.log(err));
});

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

  superagent
    .get(url)
    .then(data => res.send(JSON.parse(data.text).objects));
});

app.get('/zones', (req, res) => {
  superagent
    .get(NWAC_URL + '/zone/?format=json')
    .then(data => res.send(JSON.parse(data.text).objects));
});

// app.get('/api/v1/feedback', (req, res) => {
//   console.log('request = ', req);
//   client.query('SELECT * FROM feedback;')
//     .then(result => {
//       console.log(result);
//       res.send(result.rows);
//     }).catch(err => {
//       console.error(err);
//     });
// });

// app.post('/api/v1/feedback', (req, res) => {
//   client.query(`
//   INSERT INTO feedback (name, email, location, comments, rating)
//   VALUES($1, $2, $3, $4, $5);
//   `,
//     [
//       req.body.name,
//       req.body.email,
//       req.body.location,
//       req.body.comments,
//       req.body.rating
//     ]
//   ).then(() => res.send('inserted successfully'))
//     .catch(err => console.error(err));
// });

// app.delete('/api/v1/feedback/:id', (req, res) => {
//   client.query(`
//   DELETE FROM feedback WHERE feedback_id=$1;  
//   `,
//     [req.params.id]
//   ).then(result => res.status(204).send(result))
//     .catch(err => console.error(err));
// });

// app.put('/api/v1/feedback/:name', (req, res) => {
//   client.query(`
//   UPDATE feedback
//   SET email='${req.body.email}', location='${req.body.location}', comments='${req.body.comments}', rating=${req.body.rating}
//   WHERE name='${req.body.name}';
//   `
//   ).then( () => {
//     res.send('updated successfully');
//   })
//     .catch(err => console.error(err));
// });

app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});