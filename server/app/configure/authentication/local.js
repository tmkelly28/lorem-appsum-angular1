'use strict';

const passport = require('passport'),
  _ = require('lodash'),
  LocalStrategy = require('passport-local').Strategy,
  mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = function (app) {

  function strategyFn (email, password, done) {
    User.findOne({ email: email })
      .then(user => {
        if (!user || !user.correctPassword(password)) done(null, false);
        else done(null, user);
      })
      .catch(err => {
        done(err);
      });
  };

  passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, strategyFn));

  app.post('/signup', function (req, res, next) {
    User.create(req.body)
      .then(user => {
        req.logIn(user, loginErr => {
          if (loginErr) return next(loginErr);
          res.status(200).send({
            user: _.omit(user.toJSON(), ['password', 'salt'])
          });
        });
      })
      .then(null, next);
  });

  app.post('/login', function (req, res, next) {

    function authCb (err, user) {

      if (err) return next(err);

      if (!user) {
        let error = new Error('Invalid login credentials.');
        error.status = 401;
        return next(error);
      }

      req.logIn(user, loginErr => {
        if (loginErr) return next(loginErr);
        res.status(200).send({
          user: _.omit(user.toJSON(), ['password', 'salt'])
        });
      });
    };

    passport.authenticate('local', authCb)(req, res, next);
  });
};
