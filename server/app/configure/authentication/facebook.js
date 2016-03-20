'use strict';

const passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  mongoose = require('mongoose');

const UserModel = mongoose.model('User');

module.exports = function (app) {

  const facebookConfig = app.getValue('env').FACEBOOK,
    facebookCredentials = {
    clientID: facebookConfig.clientID,
    clientSecret: facebookConfig.clientSecret,
    callbackURL: facebookConfig.callbackURL
  };

  function verifyCallback (accessToken, refreshToken, profile, done) {

    UserModel.findOne({ 'facebook.id': profile.id }).exec()
    .then(user => {

      if (user) return user;
      else return UserModel.create({
        facebook: {
          id: profile.id
        }
      });
    })
    .then(userToLogin => done(null, userToLogin))
    .catch(err => {
      console.error('Error creating user from Facebook authentication', err);
      done(err);
    });
  }

  passport.use(new FacebookStrategy(facebookCredentials, verifyCallback));

  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
      (req, res) => res.redirect('/'));
};
