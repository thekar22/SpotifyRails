angular.module('sharedUtilModule')
.service('recommendationService', ['$http', function ($http) {

  var service = {  
    getRecommendations: function (seedSongs, audioProfile) {    	
      return $http({
        method: 'POST',
        data: $.param({}),
        url: '/recommendations',
        headers: {
        	'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    }
  };
  return service;
}]);