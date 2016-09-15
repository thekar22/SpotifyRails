angular
	.module('tagModule', ['tagService', 'ngTagsInput', 'angular-jqcloud', 'ui.grid', 'ui.grid.selection', 'uiGridService', 'sharedUtilService'])
	.controller('tagController', ['$scope', 'tagService', '$http', 'uiGridService', '$rootScope', '$routeParams', '$mdDialog', '$mdToast', 'sharedUtilService', function tagController($scope, tagService, $http, uiGridService, $rootScope, $routeParams, $mdDialog, $mdToast, sharedUtilService) {
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
			$scope.filteredSongsDictionary = {};
			if (playlistIds.length != 0)
			{
				$rootScope.$broadcast('loading.loading', {key:"getPlaylistSongs", val: "Loading Songs..."});
				tagService["getPlaylist" + filterType](playlistIds).then(function(response){ 
					$rootScope.$broadcast('loading.loaded', {key:"getPlaylistSongs"});
					$scope.filteredSongs = response.data;					
					for(var i = 0; i < $scope.filteredSongs.length; i ++)
					{
						$scope.filteredSongsDictionary[$scope.filteredSongs[i].song_id] = $scope.filteredSongs[i];
					}
					$scope.gridOptions.data = $scope.filteredSongs;
				});
			}
		}

		$scope.onNewTagButtonClick = function(ev)
		{
			var confirm = $mdDialog.prompt()
				.title('Create New Tag')
				.textContent('New tags are created as playlists in Spotify')
				.placeholder('Type here')
				.ariaLabel('Tagname')
				.initialValue('Your New Tag')
				.targetEvent(ev)
				.ok('Create!')
				.cancel('Cancel');

			$mdDialog.show(confirm).then(
				function(result) {
					$rootScope.$broadcast('loading.loading', {key:"addNewTag", val: "Creating New Tag..."});
					return tagService.addNewTag(result, null).then(function(response){
						$rootScope.$broadcast('loading.loaded', {key:"addNewTag"});
						
						var tag = response.data
						$scope.tagCloud.push({ 
							text: tag.name, 
							weight: tag.total, 
							id: tag.playlist_id,
							handlers: { 
								click: function() {
									return function() {
										$scope.tags.push({text: tag.name, weight: tag.total, id: tag.playlist_id});
										$scope.queryResults();
									}
								}()
							}
						});

						$mdToast.show(
							$mdToast.simple()
								.textContent('Tag Created!')
								.hideDelay(3000)
						);
						return false;
					});
				}, 
				function() {
					$scope.status = 'There was a failure';
				}
			);
		}

		$scope.addToNewTag = function(row)
		{
			$scope.selectedSongs.push(row.entity);
		}

		function setupGrid()
		{
			$scope.gridOptions = uiGridService.createGridOptions($scope, function(row){
				// on row select
			});
		}

		function initVars() {
			// songs returned from user filtering action
			$scope.filteredSongs = [];
			// songs in dictionary by id
			$scope.filteredSongsDictionary = {};
			// for tag cloud
			$scope.colors = ["#111111", "#333333", "#555555", "#777777", "#999999", "#bbbbbb", "#dddddd"];
			// all user tags
			$scope.tagCloud = [];
			// chosen tags for filtering
			$scope.tags = [];
			// all user tags in dictionary by playlist id
			$scope.tagDictionary = {};
			// songs for custom list
			$scope.selectedSongs = []

			// default filter union
			$scope.filter = {
				name: 'Union'
			};

		}

		function initWatchVars()
		{
			//watch variables
			$scope.$watch('filter.name', function () {
				$scope.queryResults();
			});
			$scope.$watch('tags', function (newVal, oldVal) { 
				if ($scope.tags.length < 1)
				{
					$scope.filteredSongsDictionary = {};
					$scope.tagView = "tag-cloud";
				}
				else
				{
					$scope.queryResults();
					$scope.tagView = "tag-results";
				}
			}, true);

			// on any navigation event back to tag cloud, query results
			$rootScope.$on( "$routeChangeStart", function(event, next, current) {
				if (next.$$route.originalPath == "/")
				{
					$scope.queryResults();
				}
			});
		}

		function createCloud(playlists) {
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
		}

		function initModule() {		

			setupGrid();
			initVars();
			initWatchVars();

			// initial load
			$scope.tagView = "tag-cloud";
			$rootScope.$broadcast('loading.loading', {key:"getPlaylists", val: "Loading Playlists..."});
			tagService.getUserPlaylists().then(function(response){
				$rootScope.$broadcast('loading.loaded', {key:"getPlaylists"});				
				createCloud(response.data);
				
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