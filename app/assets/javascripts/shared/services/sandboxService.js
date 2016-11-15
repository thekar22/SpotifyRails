angular.module('sharedUtilModule')
.factory('sandboxService', [function(){
	var factory = {};
	factory.sandboxSongs = [];

	factory.extractSongIds = function(songRows) {
		return songRows.map(function(song){
			return song.song_id
		});
	}

	factory.onAddToSandbox = function(rows) {
		console.log('here');
		for (var i = 0; i < rows.length; i++) {
			factory.sandboxSongs.push(rows[i]);
		}
	}

	factory.removeFromSandbox = function(row) {
		console.log(factory.sandboxSongs);
		var index = factory.sandboxSongs.indexOf(row.entity);
		factory.sandboxSongs.splice(index, 1);
	}
	
	return factory;
}]);