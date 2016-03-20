'use strict';

const passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  mongoose = require('mongoose');

const UserModel = mongoose.model('User');

module.exports = function (app) {

  const googleConfig = app.getValue('env').GOOGLE,
    googleCredentials = {
    clientID: googleConfig.clientID,
    clientSecret: googleConfig.clientSecret,
    callbackURL: googleConfig.callbackURL
  };

  function verifyCallback (accessToken, refreshToken, profile, done) {
    UserModel.findOne({ 'google.id': profile.id }).exec()
      .then(user => {
        if (user) return user;
        else return UserModel.create({
          google: {
            id: profile.id
          }
        });
      })
      .then(userToLogin => done(null, userToLogin))
      .catch(err => {
        console.error('Error creating user from Google authentication', err);
        done(err);
      });
  }

  passport.use(new GoogleStrategy(googleCredentials, verifyCallback));

  app.get('/auth/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }));

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/'));
};
