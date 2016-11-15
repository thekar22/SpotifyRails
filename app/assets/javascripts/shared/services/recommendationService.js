angular.module('sharedUtilModule')
.service('recommendationService', ['$http', function ($http) {

  var service = {  
    getRecommendations: function (seedSongs, audioProfile) {    	
      return $http({
        method: 'POST',
        data: $.param({seedTracks: seedSongs, audioFeatures: audioProfile}),
        url: '/recommendations',
        headers: {
        	'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }
  };
  return service;
}]);