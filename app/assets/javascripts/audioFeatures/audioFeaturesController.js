angular
	.module('audioFeaturesModule', ['audioFeaturesService', 'ng-rails-csrf'])
	.controller('audioFeaturesController', ['$scope', 'audioFeaturesService', function audioFeaturesController($scope, audioFeaturesService) {
		$scope.loading = 'Loading Features...';
		$scope.features = [];
		
		$scope.getAudioFeatures = function(songIds, i, features) {
			var maxPerRequest = 100;
			var totalSongs = songIds.length;
			var idsForFetching = [];

			// base case
			if ( (totalSongs - i) <= maxPerRequest) {

				idsForFetching = songIds.slice(i, totalSongs);

				audioFeaturesService.getAudioFeaturesFromSongIds(idsForFetching).then(function(response){  			
					$scope.loading = 'Features Loaded!';
					features = features.concat(response.data);
					
					var tempFeature = {};
					for(var feature in features)
					{
						tempFeature = features[feature];
						$scope.songs[tempFeature.id]['audio_features'] = tempFeature;
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
		var numSongs = Object.keys($scope.songs).length;
		if (numSongs != 0) {		
			var songIds = [];
		for (var key in $scope.songs) {
				if ($scope.songs.hasOwnProperty(key)) {  				
				songIds.push($scope.songs[key]['songInfo'].song_id);
				}
		}

			$scope.getAudioFeatures(songIds, i, $scope.features);	
		}
		else {
			$scope.loading = 'No Songs selected';
		}
}]);