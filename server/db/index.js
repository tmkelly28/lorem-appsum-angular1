'use strict';

const Promise = require('bluebird'),
  path = require('path'),
  chalk = require('chalk'),
  DATABASE_URI = require(path.join(__dirname, '../env')).DATABASE_URI,
  mongoose = require('mongoose');

const db = mongoose.connect(DATABASE_URI).connection;

// Require our models -- these should register the model into mongoose
// so the rest of the application can simply call mongoose.model('User')
// anywhere the User model needs to be used.
require('./models');

const startDbPromise = new Promise(function (resolve, reject) {
  db.on('open', resolve);
  db.on('error', reject);
});

console.log(chalk.yellow('Opening connection to MongoDB . . .'));
startDbPromise.then(() => console.log(chalk.green('MongoDB connection opened!')));

module.exports = startDbPromise;
