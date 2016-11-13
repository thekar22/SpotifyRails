angular
	.module('audioFeaturesModule', ['audioFeaturesService'])
	.controller('audioFeaturesController', ['$scope', 'audioFeaturesService', '$rootScope', 'filteredSongsService', function audioFeaturesController($scope, audioFeaturesService, $rootScope, filteredSongsService) {
		
		$scope.features = [];
		
		$scope.getAudioFeatures = function(songIds, i, features) {
			var maxPerRequest = 100;
			var totalSongs = songIds.length;
			var idsForFetching = [];

			// base case
			if ( (totalSongs - i) <= maxPerRequest) {

				idsForFetching = songIds.slice(i, totalSongs);

				audioFeaturesService.getAudioFeaturesFromSongIds(idsForFetching).then(function(response){  			
					$rootScope.$broadcast('loading.loaded', {key:"loadingFeatures"});
					features = features.concat(response.data);
					
					var tempFeature = {};
					for(var feature in features)
					{
						tempFeature = features[feature];
						filteredSongsService.filteredSongsDictionary[tempFeature.id].audio_features = tempFeature;
					}
					$scope.features = features;
					audioFeaturesService.initializeAudioFeatureAggregates($scope);

					console.log("Total features: " + features.length);
				});
			}

			// recursive step
			else if ( (totalSongs - i) > maxPerRequest) {
				idsForFetching = songIds.slice(i, i + maxPerRequest);

				audioFeaturesService.getAudioFeaturesFromSongIds(idsForFetching).then(function(response){  			
					features = features.concat(response.data);
					i = i + maxPerRequest;

					console.log("Recursive call made");
					$scope.getAudioFeatures(songIds, i, features);
				});
			}
		}

		var i = 0;
		var numSongs = Object.keys(filteredSongsService.filteredSongsDictionary).length;
		if (numSongs != 0) {			
			var songIds = Object.keys(filteredSongsService.filteredSongsDictionary).map(function(key){
				return filteredSongsService.filteredSongsDictionary[key].song_id;
			});

			$rootScope.$broadcast('loading.loading', {key:"loadingFeatures", val: "Loading"});
			$scope.getAudioFeatures(songIds, i, $scope.features);	
		}
		else {
			$scope.message = 'No Songs selected';
		}
}]);



