angular.module('songsService', [])
.service('songsService', ['$http', function ($http) {
  var service = {
    getPlaylistUnion: function (ids) {
    	console.log(JSON.stringify(ids));
    	return $http({
		    method: 'GET',
		    url: '/playlistUnion?' + $.param({playlistids: ids})
      });
    }
  };
  return service;
}]);