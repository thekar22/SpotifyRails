angular.module('playlistService', [])
.service('playlistService', ['$http', function ($http) {

  var service = {
    getUserPlaylists: function () {
      return $http.get('/playlists');
    }
  };
  return service;

}]);