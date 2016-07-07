angular.module('tagService', [])
.service('tagService', ['$http', function ($http) {

  var service = {
    getUserPlaylists: function (sync) {      
      return $http({
        method: 'GET',
        url: '/playlists'
      });
    },
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