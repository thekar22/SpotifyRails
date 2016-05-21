angular.module('songsService', [])
.service('songsService', ['$http', function ($http) {

  var service = {
    getSongsFromPlaylists: function (ids) {
    	console.log(JSON.stringify(ids));
    	return $http({
		method: 'GET',
		url: '/songs?' + $.param({pids: ids})
	});
  }
  };
  return service;

}]);