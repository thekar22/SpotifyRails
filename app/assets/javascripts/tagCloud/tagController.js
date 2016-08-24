angular
	.module('tagModule', ['tagService', 'ngTagsInput', 'ng-rails-csrf', 'angular-jqcloud', 'ui.grid', 'ui.grid.selection', 'sharedUtilService', 'uiGridService'])
	.controller('tagController', ['$scope', 'tagService', '$http', 'sharedUtilService', 'uiGridService', '$rootScope', function tagController($scope, tagService, $http, sharedUtilService, uiGridService, $rootScope) {
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
			if ($scope.tags.length > 0)
			{
				$scope.tagView = "tag-results";	
				$scope.getPlaylistSongs($scope.filter.name);	
			}
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

				$rootScope.$broadcast('loading.loading', {key:"getPlaylistSongs", val: "Loading Songs..."});
				tagService["getPlaylist" + filterType](playlistIds).then(function(response){ 
					$rootScope.$broadcast('loading.loaded', {key:"getPlaylistSongs"});
					var allSongs = response.data;					
					for(var i = 0; i < allSongs.length; i ++)
					{
						$scope.songs[allSongs[i].song_id] = allSongs[i];
					}
					$scope.gridOptions.data = allSongs;
				});
			}
		}

		function setupGrid()
		{
			$scope.gridOptions = uiGridService.createGridOptions($scope, 'song_id');
			$scope.gridOptions.columnDefs = [
				{ name: 'name', displayName: 'Title'},
				{ name: 'artist'},
				{ name: 'song_id', visible: false}
			];
		}

		function initModule(){		

			setupGrid();

			// for tag cloud
			$scope.colors = ["#111111", "#333333", "#555555", "#777777", "#999999", "#bbbbbb", "#dddddd"];
			// all tags
			$scope.tagCloud = [];
			// chosen tags
			$scope.tags = [];
			// songs from chosen tags
			$scope.songs = {};
			// default filter union
			$scope.filter = {
				name: 'Union'
			};

			//watch variables
			$scope.$watch('filter.name', function () {
				$scope.queryResults();
			});
			$scope.$watch('tags', function (newVal, oldVal) { 
				if ($scope.tags.length < 1)
				{
					$scope.tagView = "tag-cloud";
				}
			}, true);

			// initial load
			$rootScope.$broadcast('loading.loading', {key:"getPlaylists", val: "Loading Playlists..."});
			tagService.getUserPlaylists().then(function(response){
				$rootScope.$broadcast('loading.loaded', {key:"getPlaylists"});
				var playlists = response.data;

				for(var playlist in playlists){					
					$scope.tagCloud.push({ 
						text: playlists[playlist].name, 
						weight: playlists[playlist].total, 
						id: playlists[playlist].id, 
						handlers: { click: function() {							
								var index = angular.copy(playlist);
								return function() {									
									$scope.tags.push({text: playlists[index].name, weight: playlists[index].total, id: playlists[index].id});									
									$scope.queryResults();									
								}
							}()
						}
					});
				}			
				$scope.tagView = "tag-cloud";
			});
		}
	}
]);