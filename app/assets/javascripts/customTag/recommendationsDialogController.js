angular
	.module('customTagModule')
	.controller('recommendationsDialogController', ['$scope', '$mdDialog', 'customSongs', 'audioFeaturesService',
		function recommendationsDialogController($scope, $mdDialog, customSongs, audioFeaturesService) {
		$scope.customSongs = customSongs;

		var ids = customSongs.map(function(song) {
			return song.song_id;
		})

		console.log('ids', ids);

		$scope.closeDialog = function() {
			$mdDialog.hide();
		}

		$scope.generate = function() {
			$scope.closeDialog();
		}
}]);