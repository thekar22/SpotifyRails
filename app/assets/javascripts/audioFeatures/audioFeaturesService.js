angular.module('audioFeaturesService', ['sharedUtilService'])
.service('audioFeaturesService', ['$http', 'sharedUtilService', function ($http, sharedUtilService) {
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
    },
  
    initializeAudioFeatureAggregates: function ($scope){
      var features = $scope.features;

      $scope.valence = getAggregate(features, "valence", "Mean");
      $scope.tempo = getAggregate(features, "tempo", "Mean");
      $scope.instrumentalness = getAggregate(features, "instrumentalness", "Mean");
      $scope.popularity = getAggregate(features, "popularity", "Mean");
      $scope.energy = getAggregate(features, "energy", "Mean");
      $scope.acousticness = getAggregate(features, "acousticness", "Mean");
    }
  };

  function getAggregate (features, featureName, aggregateType)
  {
    nums = []
    for (var i = 0; i < features.length; i++)
    {
      nums.push(features[i][featureName]);
    }

    return sharedUtilService["get" + aggregateType](nums);
  }
  return service;
}]);