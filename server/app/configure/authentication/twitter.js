'use strict';

const passport = require('passport'),
  TwitterStrategy = require('passport-twitter').Strategy,
  mongoose = require('mongoose');

const UserModel = mongoose.model('User');

module.exports = function (app) {

  const twitterConfig = app.getValue('env').TWITTER,
    twitterCredentials = {
    consumerKey: twitterConfig.consumerKey,
    consumerSecret: twitterConfig.consumerSecret,
    callbackUrl: twitterConfig.callbackUrl
  };

  function createNewUser (token, tokenSecret, profile) {
    return UserModel.create({
      twitter: {
        id: profile.id,
        username: profile.username,
        token: token,
        tokenSecret: tokenSecret
      }
    });
  }

  function updateUserCredentials (user, token, tokenSecret, profile) {
    user.twitter.token = token;
    user.twitter.tokenSecret = tokenSecret;
    user.twitter.username = profile.username;

    return user.save();
  }

  function verifyCallback (token, tokenSecret, profile, done) {

    UserModel.findOne({'twitter.id': profile.id}).exec()
      .then(user => {
        if (user) return updateUserCredentials(user, token, tokenSecret, profile);
        else return createNewUser(token, tokenSecret, profile);
      })
      .then(user => done(null, user))
      .catch(err => {
        console.error('Error creating user from Twitter authentication', err);
        done(err);
      });
  }

  passport.use(new TwitterStrategy(twitterCredentials, verifyCallback));

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {failureRedirect: '/login'}),
    function (req, res) {
      res.redirect('/');
    });

};
