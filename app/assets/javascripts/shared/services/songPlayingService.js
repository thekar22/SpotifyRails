angular.module('sharedUtilModule')
.factory('songPlayingService', ['$sce', function($sce) {
	var factory = {};
	factory.song = { songUrl:"" };

	factory.pushSongById = function(id) {
		// factory.song.songUrl = $sce.trustAsResourceUrl('https://embed.spotify.com/?uri=spotify:track:' + id);
		factory.song.songUrl = 'https://embed.spotify.com/?uri=spotify:track:' + id;
	};

  return factory;
}]);