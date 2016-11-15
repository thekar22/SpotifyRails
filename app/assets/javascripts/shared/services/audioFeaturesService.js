angular.module('sharedUtilModule')
.service('audioFeaturesService', ['$http', 'sharedUtilService', function ($http, sharedUtilService) {
  var service = {
    getAudioFeaturesFromSongIds: function (ids) {
    	return $http({
		    method: 'POST',
        data: $.param({songIds: ids}),
		    url: '/getAudioFeatures?',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        }
	    });
    },
  
    initializeAudioFeatureAggregates: function ($scope){
      var features = $scope.features;

      $scope.valence = getAggregate(features, "valence", "Mean");
      $scope.tempo = getAggregate(features, "tempo", "Mean");
      $scope.instrumentalness = getAggregate(features, "instrumentalness", "Mean");
      $scope.energy = getAggregate(features, "energy", "Mean");
      $scope.acousticness = getAggregate(features, "acousticness", "Mean");
    }, 

    getFeatures: function(songIds) {

      var promises = [];

      var totalCount = songIds.length;
      var promiseCount = 0;
      var idsForFetching;
      var i = 0;

      while ( i < totalCount) {
        idsForFetching = songIds.slice(i, i + 100)
        promises[promiseCount] = service.getAudioFeaturesFromSongIds(idsForFetching);
        i += 100;
        promiseCount++;
      }

      return Promise.all(promises);
    },

    getAggregate: function(features, featureName, aggregateType) {            
      nums = []
      for (var i = 0; i < features.length; i++)
      {
        nums.push(features[i][featureName]);
      }

      return sharedUtilService["get" + aggregateType](nums);
    }
  };
  return service;
}]);