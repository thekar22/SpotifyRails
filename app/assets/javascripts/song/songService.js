angular.module('songService', [])
.service('songService', ['$http', function ($http) {

  var service = {
    getCurrentTags: function (songId) {
    	return $http({
  	    method: 'GET',
  	    url: '/currentTags?' + $.param({playlistids: songId})
      });
    }
  };
  return service;

}]);