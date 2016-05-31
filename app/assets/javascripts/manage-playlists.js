var app = angular.module('MusicApp', ['templates', 'ngRoute', 'playlistService', 'songsService', 'audioFeaturesService', 'ng-rails-csrf']);

app.config(function($routeProvider) {
	//set up routes
	$routeProvider
		.when('/', {
			templateUrl: '_playlists.html'
	})
		.when('/songs', {
			templateUrl: '_songs.html',
			controller: 'songsController'
	})
		.when('/audioFeatures', {
			templateUrl: '_audio_features.html',
			controller: 'audioFeaturesController'
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

  $scope.setSongIds = function(ids) {
    $scope.songIds = ids;
  };

}]);


app.controller('songsController', ['$scope', 'songsService', function($scope, songsService){
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
			songsService.getSongsFromPlaylists(playlistIds).then(function(response){  		
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
	
}]);

app.controller('audioFeaturesController', ['$scope', 'audioFeaturesService', function($scope, audioFeaturesService){
	$scope.loading = 'Loading Features...';
	$scope.features = [];
	
  	$scope.getAudioFeatures = function(songIds, i, features){

	  	var maxPerRequest = 100;
	  	var totalSongs = songIds.length;
	  	var idsForFetching = [];

	  	//base case
	  	if ( (totalSongs - i) <= maxPerRequest) {

	  		idsForFetching = songIds.slice(i, totalSongs);

	  		audioFeaturesService.getAudioFeaturesFromSongIds(idsForFetching).then(function(response){  			
	  			features = features.concat(response.data);
	  			
	  			var tempFeature = {};
	  			for(var feature in features)
	  			{
	  				tempFeature = features[feature];
	  				$scope.songs[tempFeature.id]['audio_features'] = tempFeature;
	  			}
	  			$scope.features = features;
	  			console.log(JSON.stringify(features));
	  			console.log("Total features: " + features.length);
	  		});
	  	}

	  	//recursive step
	  	else if ( (totalSongs - i) > maxPerRequest) {
	  		idsForFetching = songIds.slice(i, i + maxPerRequest);

	  		audioFeaturesService.getAudioFeaturesFromSongIds(idsForFetching).then(function(response){  			
	  			features = features.concat(response.data);
	  			i = i + maxPerRequest;

	  			console.log("Recursive call made");
	  			$scope.getAudioFeatures(songIds, i, features);
	  		});
	  	}
  	}

  	var i = 0;
  	if ($scope.songIds.length != 0) {
  		$scope.getAudioFeatures($scope.songIds, i, $scope.features);	
  	}
  	else {
  		$scope.loading = 'No Songs selected';
  	}
  	
}]);
