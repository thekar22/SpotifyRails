angular.module('songService', [])
.service('songService', ['$http', function ($http) {

	var service = {
		getCurrentTags: function (songId) {
			return $http({
				method: 'GET',
				url: '/currentTags?' + $.param({songId: songId})
			});
		},
		getSong: function (songId) {
			return $http({
				method: 'GET',
				url: '/song?' + $.param({songId: songId})
			});
		}
	};

	return service;
}]);