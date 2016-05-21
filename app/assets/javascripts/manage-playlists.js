var app = angular.module('MusicApp', ['playlistService', 'songsService']);

app.controller('playlistController', ['$scope', 'playlistService', 'songsService', function($scope, playlistService, songsService){
  $scope.loading = 'Loading Playlists...';

  //once playlists are retrieived, store them in dictionary
  var lookup = {};
  //array containing selected playlists
  $scope.selected = {};


  playlistService.getUserPlaylists().then(function(response){
  	  $scope.loading = '';
  	  $scope.playlists = response.data;

  	  //put playlists in dictionary lookup object
  	  for(var i = 0; i < $scope.playlists.length; i++){
  	  	lookup[$scope.playlists[i].id] = $scope.playlists[i];
  	  }
  });


  $scope.buttonClicked = function(){
  	var chosenPlaylist = {};
  	playlistIds = []
  	for(var playlist in $scope.selected)
  	{
  		chosenPlaylist = $scope.selected[playlist];
  		if(chosenPlaylist)
  		{
			playlistIds.push(chosenPlaylist);	
  		}
  	}
  	songsService.getSongsFromPlaylists(playlistIds).then(function(response){
  		//TODO use this response to display new view using angular
  		console.log(response.data.length);
  	});

  }

}]);