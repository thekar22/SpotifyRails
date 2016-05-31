angular.module('audioFeaturesService', [])
.service('audioFeaturesService', ['$http', function ($http) {

  var service = {
    getAudioFeaturesFromSongIds: function (ids) {
    	return $http({
		method: 'POST',
    data: $.param({songids: ids}),
		url: '/getAudioFeatures?',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    }
	});
  }
  };
  return service;

}]);