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
					$scope.allSongs = response.data;					
					for(var i = 0; i < $scope.allSongs.length; i ++)
					{
						$scope.songs[$scope.allSongs[i].song_id] = $scope.allSongs[i];
					}
					$scope.gridOptions.data = $scope.allSongs;
				});
			}
		}

		$scope.onNewTagButtonClick = function()
		{
			sharedUtilService.redirect('#/search');
		}

		$scope.addToNewTag = function()
		{
			//TODO
		}

		$scope.goToSelectedSong = function(row) { 
			sharedUtilService.redirect('#/song/' + row.entity['song_id']);
		};

		function setupGrid()
		{
			$scope.gridOptions = uiGridService.createGridOptions($scope, function(row){
				// on row select
			});

			$scope.gridOptions.columnDefs.push({ 
				name: 'Add', 
				cellTemplate: '<div class="tagAddCustom" ng-click="grid.appScope.addToNewTag(row)"> + </div>'
			});
		}

		function initModule(){		

			setupGrid();

			$scope.allSongs = [];
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

				// tag id specified in url
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