'use strict';

window.app = angular.module('LoremAppsum', ['ui.router', 'ui.bootstrap', 'ngAnimate']);

app.config(($urlRouterProvider, $locationProvider) => {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
  $urlRouterProvider.when('/auth/:provider', () => window.location.reload());
});

app.run(($rootScope, AuthService, $state) => {
  function destinationStateRequiresAuth (state) {
    return state.data && state.data.authenticate;
  };

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

    if (!destinationStateRequiresAuth(toState)) return;
    if (AuthService.isAuthenticated()) return;

    event.preventDefault();

    AuthService.getLoggedInUser().then(function (user) {
      if (user) $state.go(toState.name, toParams);
      else $state.go('login');
    });
  });
});
