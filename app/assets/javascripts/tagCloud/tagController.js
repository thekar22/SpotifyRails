angular
	.module('tagModule', ['tagService', 'ngTagsInput', 'angular-jqcloud', 'ui.grid', 'ui.grid.selection', 'uiGridService', 'sharedUtilService'])
	.controller('tagController', ['$scope', 'tagService', '$http', 'uiGridService', '$rootScope', '$routeParams','sharedUtilService', function tagController($scope, tagService, $http, uiGridService, $rootScope, $routeParams, sharedUtilService) {
		initModule();

		$scope.loadTags = function($query) {
			var tags = $scope.tagCloud;
			return tags.filter(function(tag) {
				return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
			});
		};

		$scope.queryResults = function() {
			if ($scope.tags.length > 0)
			{				
				var ids = $scope.getTagIds($scope.tags)
				$scope.getPlaylistSongs(ids, $scope.filter.name);	
			}
		}

		$scope.getTagIds = function (tags)
		{
			var playlistIds = $scope.tags.map(function(tag){
				return tag.id;
			});
			return playlistIds;
		}

		$scope.getPlaylistSongs = function(playlistIds, filterType) {
			$scope.songs = {};
			if (playlistIds.length != 0)
			{
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
			$scope.gridOptions = uiGridService.createGridOptions($scope, function(row){
				sharedUtilService.redirect('#/song/' + row.entity['song_id']);
			});

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
			$scope.tagDictionary = {};

			//watch variables
			$scope.$watch('filter.name', function () {
				$scope.queryResults();
			});
			$scope.$watch('tags', function (newVal, oldVal) { 
				if ($scope.tags.length < 1)
				{
					$scope.songs = {};
					$scope.tagView = "tag-cloud";
				}
				else
				{
					$scope.queryResults();
					$scope.tagView = "tag-results";
				}
			}, true);

			// initial load
			$scope.tagView = "tag-cloud";
			$rootScope.$broadcast('loading.loading', {key:"getPlaylists", val: "Loading Playlists..."});

			$rootScope.$on( "$routeChangeStart", function(event, next, current) {
				if (next.$$route.originalPath == "/")
				{
					$scope.queryResults();
				}
			});

			tagService.getUserPlaylists().then(function(response){
				$rootScope.$broadcast('loading.loaded', {key:"getPlaylists"});
				var playlists = response.data;

				for(var playlist in playlists) {

					$scope.tagDictionary[playlists[playlist].id] = playlists[playlist];
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

				if($routeParams.id)
				{
					$scope.tags = [];
					if($scope.tagDictionary[$routeParams.id])
					{
						var tag = $scope.tagDictionary[$routeParams.id]
						$scope.tags.push({text: tag.name, weight: tag.total, id: tag.id});
						$scope.getPlaylistSongs([tag.id], $scope.filter.name);
					}
				}
			});
		}
	}
]);