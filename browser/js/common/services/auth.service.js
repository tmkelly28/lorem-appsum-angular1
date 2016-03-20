'use strict';

app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

  function onSuccessfulLogin(response) {
    let data = response.data,
      id = data.id ? data.id : data._id,
      user = data.user ? data.user : data;

    Session.create(id, user);
    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    return user;
  }

  this.isAuthenticated = function () {
    return !!Session.user;
  };

  this.getLoggedInUser = function (fromServer) {

    if (this.isAuthenticated() && fromServer !== true) return $q.when(Session.user);
    return $http.get('/session')
      .then(onSuccessfulLogin)
      .catch(() => {
        return null;
    });
  };

  this.signup = function (credentials) {
    return $http.post('/signup', credentials)
      .then(onSuccessfulLogin)
      .then(null, () => $q.reject({ message: 'Invalid entry' }));
  };

  this.login = function (credentials) {
    return $http.post('/login', credentials)
      .then(onSuccessfulLogin)
      .catch(function () {
        return $q.reject({ message: 'Invalid login credentials.' });
      });
  };

  this.logout = function () {
    return $http.get('/logout').then(function () {
      Session.destroy();
      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
    });
  };

});
