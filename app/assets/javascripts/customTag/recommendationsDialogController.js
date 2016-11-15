angular
	.module('customTagModule')
	.controller('recommendationsDialogController', ['$scope', '$mdDialog', 'customSongs', 'audioFeaturesService',
		function recommendationsDialogController($scope, $mdDialog, customSongs, audioFeaturesService) {
		$scope.customSongs = customSongs;

		var ids = customSongs.map(function(song) {
			return song.song_id;
		})
		
		var features = [];		
		audioFeaturesService.getFeatures(ids).then(function(resultSets) {			
			resultSets = resultSets.map(function(set){
				return set.data;
			});

			var featureArray = Array.prototype.concat.apply([], resultSets);			
			
			var valence = audioFeaturesService.getAggregate(featureArray, "valence", "Mean")*100;
			var danceability = audioFeaturesService.getAggregate(featureArray, "danceability", "Mean")*100;
			var instrumentalness = audioFeaturesService.getAggregate(featureArray, "instrumentalness", "Mean")*100;
			var energy = audioFeaturesService.getAggregate(featureArray, "energy", "Mean")*100;
			var acousticness = audioFeaturesService.getAggregate(featureArray, "acousticness", "Mean")*100;

			$scope.nums = [
				{name: "Valence", score: valence},
				{name: "Instrumentalness", score: instrumentalness},
				{name: "Energy", score: energy},
				{name: "Acousticness", score: acousticness},
				{name: "Danceability", score: danceability}
			];

			$scope.nums.forEach(function(num) {
				console.log(num);
			});
			
		}).catch(function(reason) {
			console.log(reason);
		});
				
		$scope.closeDialog = function() {
			$mdDialog.hide();
		}

		$scope.generate = function() {
			$scope.closeDialog();
		}
}]);