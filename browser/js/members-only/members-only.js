app.config(function ($stateProvider) {
  $stateProvider.state('membersOnly', {
    url: '/members-area',
    template: `
      <img ng-repeat="item in stash" width="300" ng-src="{{ item }}" />
    `,
    controller: function ($scope, SecretStash) {
      SecretStash
        .getStash()
        .then(stash => {
          $scope.stash = stash;
      });
    },
    data: {
      authenticate: true
    }
  });
});

app.factory('SecretStash', function ($http) {

  function getStash () {
    return $http.get('/api/members/secret-stash')
      .then(res => res.data)
      .catch(err => console.error);
  };

  return {
    getStash: getStash
  };
});
