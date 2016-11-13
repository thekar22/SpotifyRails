angular.module('audioFeaturesService', ['sharedUtilModule'])
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
    getFeatures: function (songIds, i, features) {
      var maxPerRequest = 100;
      var totalSongs = songIds.length;
      var idsForFetching = [];

      // base case
      if ( (totalSongs - i) <= maxPerRequest) {

        idsForFetching = songIds.slice(i, totalSongs);

        getAudioFeaturesFromSongIds(idsForFetching).then(function(response){
          features = features.concat(response.data);          
          return features;
        });
      }

      // recursive step
      else if ( (totalSongs - i) > maxPerRequest) {
        idsForFetching = songIds.slice(i, i + maxPerRequest);

        audioFeaturesService.getAudioFeaturesFromSongIds(idsForFetching).then(function(response){ 
          features = features.concat(response.data);
          i = i + maxPerRequest;

          console.log("Recursive call made");
          return getFeatures(songIds, i, features);
        });
      }
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