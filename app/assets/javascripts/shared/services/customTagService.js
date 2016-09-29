angular.module('sharedUtilModule')
.factory('customTagService', [function(){
	var factory = {};
	factory.customSongs = [];

	factory.extractSongIds = function(songRows) {
		return songRows.map(function(song){
			return song.song_id
		});
	}

	factory.onAddToCustomTag = function(rows) {
		for (var i = 0; i < rows.length; i++) {
			factory.customSongs.push(rows[i]);
		}
	}

	factory.removeFromCustomTag = function(row) {
		console.log(factory.customSongs);
		var index = factory.customSongs.indexOf(row.entity);
		factory.customSongs.splice(index, 1);
	}
	
	return factory;
}]);