angular
	.module('songsModule', ['songsService', 'ng-rails-csrf'])
	.controller('songsController', ['$scope', 'songsService', songsController]);

function songsController($scope, songsService)
{
	$scope.loading = 'Loading Songs...';
  	$scope.getPlaylistSongs = function(){
		var chosenPlaylist = {};
		playlistIds = []
		for (var playlist in $scope.selected)
		{
			chosenPlaylist = $scope.selected[playlist];
			if (chosenPlaylist)
			{
			playlistIds.push(chosenPlaylist);
			}
		}
		if (playlistIds.length != 0)
		{
			var songIds = [];
			var tempId = '';
			songsService.getPlaylistUnion(playlistIds).then(function(response){  		
				$scope.loading = 'Songs Loaded!';
				$scope.allSongs = response.data;

				for(var song in $scope.allSongs)
				{
					tempId = $scope.allSongs[song].id;
					songIds.push(tempId);
					$scope.songs[tempId] = {};
					$scope.songs[tempId]['songInfo'] = $scope.allSongs[song];
				}

				var features = [];
				var i = 0;
				// save songIds to parent scope (might want to change this implementation later)
				$scope.setSongIds(songIds);
			});
		}
	}
	if (Object.keys($scope.selected).length !== 0) {
		$scope.getPlaylistSongs();
	}
	else {
		$scope.loading = 'No Playlists selected';
	}
}