angular.module('sharedUtilModule')
.factory('selectedSongsService', ['$mdDialog', function($mdDialog){
	var factory = {};
	factory.selectedSongs = [];

	factory.extractSongIds = function(songRows) {
		return songRows.map(function(song){
			return song.song_id
		});
	}

	factory.onAddSelectedSongs = function(rows) {
		factory.selectedSongs = rows;
		var parentEl = angular.element(document.body);
		$mdDialog.show({
			contentElement: '#myStaticDialog',
			parent: parentEl
		});
	}
	
	return factory;
}]);