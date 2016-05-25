var app = angular.module('MusicApp', ['playlistService', 'songsService', 'audioFeaturesService']);

app.controller('playlistController', ['$scope', 'playlistService', 'songsService', 'audioFeaturesService', function($scope, playlistService, songsService, audioFeaturesService){
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

  $scope.getPlaylistSongs = function(){
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
  	if(playlistIds.length != 0)
  	{
  		var songIds = [];
  		songsService.getSongsFromPlaylists(playlistIds).then(function(response){  		
  			var allSongs = response.data;

  			for(var song in allSongs)
  			{
  				songIds.push(allSongs[song].id);
  			}

  			var features = [];
  			var i = 0;
  			console.log("starting get for audio features...");
  			$scope.getAudioFeatures(songIds, i, features);
  		});
	}
  }

  $scope.getAudioFeatures = function(songIds, i, features){

  	var maxPerRequest = 100;
  	var totalSongs = songIds.length;
  	var idsForFetching = [];

  	//base case
  	if( (totalSongs - i) <= maxPerRequest){

  		idsForFetching = songIds.slice(i, totalSongs);

  		audioFeaturesService.getAudioFeaturesFromSongIds(idsForFetching).then(function(response){  			
  			features = features.concat(response.data);
  			
  			console.log("total features");
  			console.log(features.length);

  		});
  	}

  	//recursive step
  	else if( (totalSongs - i) > maxPerRequest)
  	{
  		idsForFetching = songIds.slice(i, i + maxPerRequest);

  		audioFeaturesService.getAudioFeaturesFromSongIds(idsForFetching).then(function(response){  			
  			features = features.concat(response.data);
  			i = i + maxPerRequest;

  			console.log("recursive call made");

  			$scope.getAudioFeatures(songIds, i, features);
  		});
  	}
  }




}]);