angular
	.module('sandboxModule')
	.controller('recommendationsDialogController', ['$scope', '$mdDialog', 'sandboxSongs', 'audioFeaturesService', 'recommendationService', 'sandboxService',
		function recommendationsDialogController($scope, $mdDialog, sandboxSongs, audioFeaturesService, recommendationService, sandboxService) {
	
		var ids = sandboxSongs.map(function(song) {
			return song.song_id;
		})

		audioFeaturesService.getFeatures(ids).then(function(resultSets) {
			resultSets = resultSets.map(function(set){
				return set.data;
			});
			var featureArray = Array.prototype.concat.apply([], resultSets);
			
			var valence = audioFeaturesService.getAggregate(featureArray, "valence", "Mean");
			var danceability = audioFeaturesService.getAggregate(featureArray, "danceability", "Mean");
			var instrumentalness = audioFeaturesService.getAggregate(featureArray, "instrumentalness", "Mean");
			var energy = audioFeaturesService.getAggregate(featureArray, "energy", "Mean");
			var acousticness = audioFeaturesService.getAggregate(featureArray, "acousticness", "Mean");

			$scope.nums = [
				{name: "Valence", score: valence},
				{name: "Instrumentalness", score: instrumentalness},
				{name: "Energy", score: energy},
				{name: "Acousticness", score: acousticness},
				{name: "Danceability", score: danceability}
			];
			
		}).catch(function(reason) {
			console.log(reason);
		});
				
		$scope.closeDialog = function() {
			$mdDialog.hide();
		}

		$scope.generate = function() {
			var seedSongs = randomize(sandboxSongs.slice(0,5), 5);
			recommendationService.getRecommendations(seedSongs, $scope.nums).then(function(response) {

				// watch on ui grid only looks for operations that directly add / remove from existing array
				while (sandboxService.sandboxSongs.length !== 0) {
					sandboxService.sandboxSongs.splice(0,1);
				}

				// add new songs
				var spotifyList = response.data.tracks;
				var songs = spotifyList.map(function(song) {
					return {name: song.name, artist: song.artists[0].name, song_id: song.id};
				});

				// watch on ui grid only looks for operations that directly add / remove from existing array
				for (var i = 0; i < songs.length; i++) {
					sandboxService.sandboxSongs.push(songs[i]);
				}

				$scope.closeDialog();
			})
		}

		function randomize(list, n) {
			var size = list.length;
			var randomIndex;
			for (var i = 0; i < size; i++) {
				randomIndex = Math.floor(Math.random()*size);
				swap(list, i, randomIndex);
			}

			return list.slice(0,5);
		}
		
		function swap(arr, i, j) {
			var temp = arr[i];
			arr[i] = arr[j];
			arr[j] = temp;
		}
}]);