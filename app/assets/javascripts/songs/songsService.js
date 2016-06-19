angular.module('songsService', [])
.service('songsService', ['$http', function ($http) {
  var service = {
    getPlaylistUnion: function (ids) {
    	return $http({
		    method: 'GET',
		    url: '/playlistUnion?' + $.param({playlistids: ids})
      });
    },
    getPlaylistIntersection: function (ids) {
      return $http({
        method: 'GET',
        url: '/playlistIntersection?' + $.param({playlistids: ids})
      });
    }
  };
  return service;
}]);