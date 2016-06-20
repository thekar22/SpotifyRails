angular
	.module('playlistModule', ['tagService', 'ngTagsInput', 'ng-rails-csrf'])
	.controller('tagController', ['$scope', 'tagService', '$http', tagController]);

function tagController($scope, tagService, $http)
{
	$scope.tagView = "tag-cloud";
	$scope.loading = 'Loading Tags...';
	// TODO consolidate tags object and tagCloud object
	$scope.tags = [];
	$scope.tagCloud = [];
	// TODO consolidate allSongs, songs, sonIds (array, dictionary, string array)
	$scope.allSongs = [];
	$scope.songs = {};
	$scope.songIds = [];
	
	initModule();

	$scope.loadTags = function($query) {
		var tags = $scope.tagCloud;
		return tags.filter(function(tag) {
			return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
		});
	};

	$scope.onTagAdded = function($tag) {
		console.log($tag);
		$scope.tagView = "tag-results";
		$scope.getPlaylistSongs();
	}

	$scope.onTagRemoved = function($tag) {
		console.log($tag);
		$scope.tagView = "tag-cloud";		
	}

	$scope.setSongIds = function(ids) {
		$scope.songIds = ids;
	};

  	$scope.getPlaylistSongs = function() {
		if ($scope.tags.length != 0)
		{
			playlistIds = [];
			for (var tag in $scope.tags)
			{
				playlistIds.push($scope.tags[tag].id);
			}

			tagService.getPlaylistUnion(playlistIds).then(function(response){  		
				$scope.loading = 'Songs Loaded!';			
				var tempId = '';
				
				$scope.allSongs = response.data;
				for(var song in $scope.allSongs)
				{
					tempId = $scope.allSongs[song].id;
					$scope.songIds.push(tempId);
					$scope.songs[tempId] = {};
					$scope.songs[tempId]['songInfo'] = $scope.allSongs[song];
				}
			});
		}
	}

	function initModule(){
		tagService.getUserPlaylists().then(function(response){
			  $scope.loading = '';
			  $scope.playlists = response.data;

			  for(var i = 0; i < $scope.playlists.length; i++){
			  	$scope.tagCloud[i] = { text: $scope.playlists[i].name, count: $scope.playlists[i].total, id: $scope.playlists[i].id};
			  }
		});
	}
}



