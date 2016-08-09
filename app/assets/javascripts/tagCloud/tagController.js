angular
	.module('tagModule', ['tagService', 'ngTagsInput', 'songCardDirective', 'ng-rails-csrf'])
	.controller('tagController', ['$scope', 'tagService', '$http', function tagController($scope, tagService, $http) {
		initModule();

		$scope.loadTags = function($query) {
			var tags = $scope.tagCloud;
			return tags.filter(function(tag) {
				return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
			});
		};

		$scope.onTagAdded = function($tag) {
			$scope.queryResults();		
		}

		$scope.onTagRemoved = function($tag) {	
			$scope.queryResults();	
		}

		$scope.queryResults = function() {
			$scope.tagView = "tag-results";			
			$scope.getPlaylistSongs($scope.filter.name);
		}

		$scope.getPlaylistSongs = function(filterType) {
			$scope.songs = {};
			if ($scope.tags.length != 0)
			{
				playlistIds = [];
				for (var tag in $scope.tags)
				{
					playlistIds.push($scope.tags[tag].id);
				}

				$scope.loading.text = 'Loading Songs...';
				tagService["getPlaylist" + filterType](playlistIds).then(function(response){ 
					$scope.loading.text = 'Songs Loaded!';			
					var tempId = '';
					var allSongs = response.data;
					for(var song in allSongs)
					{
						tempId = allSongs[song].song_id;
						$scope.songs[tempId] = {};
						$scope.songs[tempId]['songInfo'] = allSongs[song];
					}
				});
			}
		}

		function initModule(){
			// all tags
			$scope.tagCloud = [];
			// chosen tags
			$scope.tags = [];
			// songs from chosen tags
			$scope.songs = {};

			$scope.filter = {
				name: 'Union'
			};

			$scope.$watch('filter.name', function () {
	  			$scope.queryResults();
			});
			
			$scope.loading = {text: 'Loading Tags...'};
			tagService.getUserPlaylists().then(function(response){
				$scope.loading.text = 'Tags Loaded';
				var playlists = response.data;

				for(var i = 0; i < playlists.length; i++){
					$scope.tagCloud[i] = { text: playlists[i].name, count: playlists[i].total, id: playlists[i].id};
				}			
				$scope.tagView = "tag-cloud";
			});
		}
	}
]);