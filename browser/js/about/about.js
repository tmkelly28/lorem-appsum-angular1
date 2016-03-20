app.config(function ($stateProvider) {
  $stateProvider.state('about', {
    url: '/about',
    controller: 'AboutController',
    templateUrl: 'js/about/about.html'
  });
});

app.controller('AboutController', function ($scope, FullstackPics) {
  $scope.images = _.shuffle(FullstackPics);
});
