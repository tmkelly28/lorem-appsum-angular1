'use strict';

const chalk = require('chalk'),
  startDb = require('./db'),
  fs = require('fs'),
  https = require('https');

function read (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

function readCredentials () {
  return Promise.all([read('./key.pem'), read('./cert.pem')]);
}

function createServer (creds) {
  return https.createServer({
    key: creds[0],
    cert: creds[1]
  });
}

function createApplication (server) {
  const app = require('./app');
  server.on('request', app);
  require('./io')(server);
  return server;
};

function startServer (server) {
  const PORT = process.env.PORT || 8000,
    WELCOME = chalk.blue(`Server started on port ${chalk.magenta(PORT)}`);
  server.listen(PORT, () => console.log(WELCOME));
};

function handleError (err) {
  console.error(chalk.red(err.stack));
  process.kill(1);
}

startDb
  .then(readCredentials)
  .then(createServer)
  .then(createApplication)
  .then(startServer)
  .catch(handleError);
