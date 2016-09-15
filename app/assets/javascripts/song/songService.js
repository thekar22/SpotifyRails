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
		},
		addExistingTag: function (tagid, songid) {
			return $http({
				method: 'GET',
				url: '/addExistingTag?' + $.param({tagId: tagid, songId: songid})
			});
		},
		removeTag: function (tagid, songid) {
			return $http({
				method: 'GET',
				url: '/removeTag?' + $.param({tagId: tagid, songId: songid})
			});
		}
	};

	return service;
}]);