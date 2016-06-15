angular
	.module('playlistModule', ['playlistService', 'ng-rails-csrf'])
	.controller('playlistController', ['$scope', 'playlistService', playlistController]);

function playlistController($scope, playlistService)
{
	$scope.loading = 'Loading Playlists...';

	//once playlists are retrieived, store them in dictionary
	var lookup = {};
	//array containing selected playlists
	$scope.selected = {};
	//songs
	$scope.songs = {};

	playlistService.getUserPlaylists().then(function(response){
		  $scope.loading = '';
		  $scope.playlists = response.data;

		  //put playlists in dictionary lookup object
		  for(var i = 0; i < $scope.playlists.length; i++){
		  	lookup[$scope.playlists[i].id] = $scope.playlists[i];
		  }
	});

	$scope.setSongIds = function(ids) {
		$scope.songIds = ids;
	};
}