angular.module('tagService', [])
.service('tagService', ['$http', function ($http) {

  var service = {
    getUserPlaylists: function () {
      return $http.get('/playlists');
    }
  };
  return service;
}]);