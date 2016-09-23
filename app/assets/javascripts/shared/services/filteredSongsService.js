angular.module('sharedUtilModule')
.factory('filteredSongsService', [function(){
	var factory = {};
	factory.filteredSongsDictionary = {};
	factory.filteredSongs = [];

	factory.convertFilteredResultsToDictioanry = function(filteredSongs) {
		return filteredSongs.reduce(function (dict, song) {
			dict[song.song_id] = song;
			return dict;
		}, {});
	};

  return factory;
}]);