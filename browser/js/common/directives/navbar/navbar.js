app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/directives/navbar/navbar.html',
    link: function (scope) {

      scope.items = [
        { label: 'Home', state: 'home' },
        { label: 'About', state: 'about' },
        { label: 'Documentation', state: 'docs' },
        { label: 'Members Only', state: 'membersOnly', auth: true }
      ];

      scope.user = null;

      scope.isLoggedIn = function () {
        return AuthService.isAuthenticated();
      };

      scope.logout = function () {
        AuthService
          .logout()
          .then(() => $state.go('home'));
      };

      function setUser () {
        AuthService
          .getLoggedInUser()
          .then(user => scope.user = user);
      };

      function removeUser () {
        scope.user = null;
      };

      setUser();

      $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
      $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
      $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

    }

  };
});
