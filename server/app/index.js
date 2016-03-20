'use strict';

const path = require('path'),
  express = require('express');

const app = express();
module.exports = app;

require('./configure')(app);

app.use('/api', require('./routes'));

app.use((req, res, next) => {
  if (path.extname(req.path).length > 0) res.status(404).end();
  else next(null);
});

app.get('/*', (req, res) => {
  res.sendFile(app.get('indexHTMLPath'));
});

// Error catching endware.
app.use((err, req, res, next) => {
  console.error(err, typeof next);
  res.status(err.status || 500).send(err.message || 'Internal server error.');
});
