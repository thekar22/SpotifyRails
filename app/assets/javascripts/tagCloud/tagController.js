angular
	.module('tagModule', ['tagService', 'ngTagsInput', 'angular-jqcloud', 'ui.grid', 'ui.grid.selection', 'ui.bootstrap.contextMenu', 'sharedUtilModule'])
	.controller('tagController', ['$scope', 'tagService', '$http', 'uiGridService', '$rootScope', '$routeParams', '$mdDialog', '$mdToast', 'mdConfirmService', 'sharedUtilService', function tagController($scope, tagService, $http, uiGridService, $rootScope, $routeParams, $mdDialog, $mdToast, mdConfirmService, sharedUtilService) {
		initModule();

		$scope.filterTags = function($query) {
			var tags = $scope.tagCloud;
			return tags.filter(function(tag) {
				return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
			});
		};

		$scope.querySelectedTags = function() {
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
			if (playlistIds.length != 0)
			{
				$rootScope.$broadcast('loading.loading', {key:"getPlaylistSongs", val: "Loading Songs..."});
				tagService["getPlaylist" + filterType](playlistIds).then(function(response){ 
					$rootScope.$broadcast('loading.loaded', {key:"getPlaylistSongs"});
					$scope.gridOptions.data = response.data;
					$scope.filteredSongsDictionary = $scope.convertFilteredResultsToDictioanry(response.data);					
				});
			}
		}

		$scope.convertFilteredResultsToDictioanry = function(filteredSongs)
		{
			return filteredSongs.reduce(function (dict, song) {
				dict[song.song_id] = song;
				return dict;
			}, {});
		}

		$scope.onNewTagButtonClick = function(ev)
		{
			var confirm = mdConfirmService.createConfirmDialog(ev);

			$mdDialog.show(confirm).then(
				function(result) {
					$rootScope.$broadcast('loading.loading', {key:"addNewTag", val: "Creating New Tag..."});
					
					var existingTag = $scope.tagCloud.find(function(tag) { 
						return tag.text.toLowerCase() === result.toLowerCase();
					});

					if (!existingTag)
					{
						$scope.addNewTag(result);
					}
					else
					{
						$scope.showMessage("Tag already exists!");
						$rootScope.$broadcast('loading.loaded', {key:"addNewTag"});
					}
				}, 
				function() {
					$scope.showMessage("Tag creation canceled");
				}
			);
		}		

		$scope.addNewTag = function(result)
		{
			tagService.addNewTag(result, null).then(function(response){
				var tag = response.data
				$scope.addToTagCloud(tag);
				$scope.showMessage("Tag created!");
				$rootScope.$broadcast('loading.loaded', {key:"addNewTag"});
			});
		}

		$scope.addToTagCloud = function (tag)
		{
			$scope.tagCloud.push({ 
					text: tag.name, 
					weight: tag.total, 
					id: tag.playlist_id,
					handlers: { 
						click: function() {
							return function() {
								$scope.tags.push({text: tag.name, weight: tag.total, id: tag.playlist_id});
								$scope.querySelectedTags();
							}
						}()
					}
				});
		}

		$scope.showMessage = function(message)
		{
			$mdToast.show(
				$mdToast.simple()
					.textContent(message)
					.hideDelay(3000)
			);
		}

		$scope.onAddSelectedSongs = function(rows)
		{
			

			console.log(rows);
		}

		function setupGrid()
		{
			$scope.gridOptions = uiGridService.createGridOptions($scope, function(row){
				// on row select
			});

			$scope.menuOptions = [
				['Add selected songs to tag...', function ($itemScope) {
					$scope.onAddSelectedSongs($scope.gridOptions.gridApi.selection.getSelectedRows());
				}]
			];
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
				$scope.querySelectedTags();
			});
			$scope.$watch('tags', function (newVal, oldVal) { 
				if ($scope.tags.length < 1)
				{
					$scope.filteredSongsDictionary = {};
					$scope.tagView = "tag-cloud";
				}
				else
				{
					$scope.querySelectedTags();
					$scope.tagView = "tag-results";
				}
			}, true);

			// on any navigation event back to tag cloud, query results
			$rootScope.$on( "$routeChangeStart", function(event, next, current) {
				if (next.$$route.originalPath == "/")
				{
					$scope.querySelectedTags();
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
								$scope.querySelectedTags();
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