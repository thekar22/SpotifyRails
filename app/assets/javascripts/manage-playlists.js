var app = angular.module('MusicApp', ['templates', 'ngRoute', 'playlistService', 'songsService', 'audioFeaturesService', 'ng-rails-csrf']);

app.config(function($routeProvider) {
	//set up routes
	$routeProvider
		.when('/', {
			templateUrl: '_playlists.html'
	})
		.when('/songs', {
			templateUrl: '_songs.html'
	})
		.otherwise({
			redirectTo: '/'
	});
});

app.controller('playlistController', ['$scope', 'playlistService', 'songsService', 'audioFeaturesService', function($scope, playlistService, songsService, audioFeaturesService){
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
  		var tempId = '';
  		songsService.getSongsFromPlaylists(playlistIds).then(function(response){  		
  			var allSongs = response.data;

  			for(var song in allSongs)
  			{
  				tempId = allSongs[song].id;
  				songIds.push(tempId);
  				$scope.songs[tempId] = {};
  				$scope.songs[tempId]['songInfo'] = allSongs[song];
  			}

  			var features = [];
  			var i = 0;
  			console.log("Starting retrieval for audio features...");
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
  			
  			var tempFeature = {};
  			for(var feature in features)
  			{
  				tempFeature = features[feature];
  				$scope.songs[tempFeature.id]['song_features'] = tempFeature;
  			}

  			console.log("Total features: " + features.length);
  		});
  	}

  	//recursive step
  	else if( (totalSongs - i) > maxPerRequest)
  	{
  		idsForFetching = songIds.slice(i, i + maxPerRequest);

  		audioFeaturesService.getAudioFeaturesFromSongIds(idsForFetching).then(function(response){  			
  			features = features.concat(response.data);
  			i = i + maxPerRequest;

  			console.log("Recursive call made");
  			$scope.getAudioFeatures(songIds, i, features);
  		});
  	}
  }

}]);