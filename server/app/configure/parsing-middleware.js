'use strict';
const cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser');

module.exports = function (app) {

  app.use(cookieParser());
  // Parse our POST and PUT bodies.
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

};
