angular.module('sharedUtilModule')
.factory('selectedSongsService', [function(){
	var factory = {};
	factory.selectedSongs = [];

	factory.extractSongIds = function(songRows) {
		return songRows.map(function(song){
			return song.song_id
		});
	}
	
	return factory;
}]);