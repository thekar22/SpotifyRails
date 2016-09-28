angular
	.module('tagModule', ['tagService', 'ngTagsInput', 'angular-jqcloud', 'ui.grid', 'ui.grid.selection', 'ui.bootstrap.contextMenu', 'tagAddModule', 'sharedUtilModule'])
	.controller('tagController', ['$scope', 'tagService', 'tagCloudService', 'selectedSongsService', '$http', 'uiGridService', '$rootScope', '$routeParams', '$mdDialog', 'toastService', 'mdDialogService', 'sharedUtilService', 'filteredSongsService', '$location', 
	function tagController($scope, tagService, tagCloudService, selectedSongsService, $http, uiGridService, $rootScope, $routeParams, $mdDialog, toastService, mdDialogService, sharedUtilService, filteredSongsService, $location) {
		initModule();

		$scope.filterTags = function($query) {
			return tagCloudService.filterTags($query);
		};

		$scope.querySelectedTags = function() {
			if ($scope.tags.length > 0) {
				var ids = $scope.getTagIds($scope.tags)
				$scope.getPlaylistSongs(ids, $scope.filter.name);
			}
		}

		$scope.getTagIds = function (tags) {
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
					filteredSongsService.filteredSongsDictionary = filteredSongsService.convertFilteredResultsToDictioanry(response.data);
				});
			}
		}

		$scope.onNewTagButtonClick = function(ev) {
			var prompt = mdDialogService.createDialog('prompt',
				{
					title:'Create New Tag', 
					textContent: 'New tags are created as playlists in Spotify', 
					placeholder: 'Type here', 
					arialLabel: 'Tagname',
					initialValue: 'Your New Tag',
					targetEvent: ev,
					ok: 'Create!',
					cancel: 'Cancel'
				});

			$mdDialog.show(prompt).then(
				function(result) {
					$rootScope.$broadcast('loading.loading', {key:"addNewTag", val: "Creating New Tag..."});
					
					var existingTag = tagCloudService.tagCloud.find(function(tag) { 
						return tag.text.toLowerCase() === result.toLowerCase();
					});

					if (!existingTag) {
						$scope.addNewTag(result);
					}
					else {
						toastService.showMessage("Tag already exists!");
						$rootScope.$broadcast('loading.loaded', {key:"addNewTag"});
					}
				}, 
				function() {
					toastService.showMessage("Tag creation canceled.");
				}
			);
		}		

		$scope.addNewTag = function(result) {
			tagService.addNewTag(result, null).then(function(response){
				$scope.addToTagCloud(response.data);
				toastService.showMessage("Tag created!");
				$rootScope.$broadcast('loading.loaded', {key:"addNewTag"});
			});
		}

		$scope.addToTagCloud = function (tag) {
			tagCloudService.tagCloud.push({ 
				text: tag.name, 
				weight: tag.total, 
				id: tag.playlist_id,
				handlers: { 
					click: function() {
						return function() {
							$scope.tags.push({text: tag.name, weight: tag.total, id: tag.playlist_id, selected: false});
							$scope.querySelectedTags();
						}
					}()
				}
			});
		}

		$scope.onAddSelectedSongs = function(rows) {
			selectedSongsService.selectedSongs = rows;
			var outerScope = $scope;
			var parentEl = angular.element(document.body);
			$mdDialog.show({
				contentElement: '#myStaticDialog',
				parent: parentEl			
			});
		}

		$scope.onDeleteSelectedTag = function(tag) {
			var confirm = mdDialogService.createDialog('confirm',
				{
					title:'Are you want to delete "' + tag.text + '"?', 
					textContent: 'Tag and associated playlist from Spotify will be deleted ',
					arialLabel: 'Tagname',
					ok: 'Delete',
					cancel: 'Cancel'
				});
			
			$mdDialog.show(confirm).then(
				function(result) {
					if (result) {
						$rootScope.$broadcast('loading.loading', {key:"deleteTag", val: "Deleting Tag..."});

						// TODO: call service to:
						// remove from spotify
						// remove form db
						// if failure (could not find playlist), remove tag
						// if success, remove tag
						tagService.deleteTag(tag.id).then(function(response){
							console.log(response);

							toastService.showMessage("Tag deleted.");
							$rootScope.$broadcast('loading.loaded', {key:"deleteTag"});
						});
					}
				}, 
				function() {
					toastService.showMessage("Tag deletion canceled.");
				}
			);
		}

		$scope.onTagRemoved = function($tag) {
			if ($tag.id == $scope.selectedTag.id) {
				$scope.selectedTag = {};
				$tag.selected = false;
			}
		}

		$scope.onTagClicked = function ($tag) {
			$scope.selectedTag.selected = false;
			$scope.selectedTag = $tag;
			$scope.selectedTag.selected = true;
		}

		function setupGrid() {
			$scope.gridOptions = uiGridService.createGridOptions($scope, function(row){
				// on row select
			});
			
			setupGridContextMenu();
		}

		function setupGridContextMenu() {
			$scope.menuOptions = [
				[
					'Add selected songs to tag...', 
					function ($itemScope) {
						$scope.onAddSelectedSongs($scope.gridOptions.gridApi.selection.getSelectedRows());
					},
					function ($itemScope) { // function to determine whether menu option should be enabled/disabled
						if ($scope.gridOptions.gridApi.selection.getSelectedRows().length > 0){
							return true;
						}
						return false;
					}
				]
			];
		}

		function setupTagContextMenu() {
				$scope.tagOptions = [
				[
					'Delete selected tag and playlist from Spotify...', 
					function () {
						$scope.onDeleteSelectedTag($scope.selectedTag);
					},
					function () { // function to determine whether menu option should be enabled/disabled
						if (Object.keys($scope.selectedTag).length !== 0) {
							return true;
						}
						return false;
					}
				]
			];
		}

		function initVars() {
			// for tag cloud
			$scope.colors = ["#111111", "#333333", "#555555", "#777777", "#999999", "#bbbbbb", "#dddddd"];
			// all user tags
			$scope.tagCloud = [];
			// chosen tags for filtering
			$scope.tags = [];
			// default filter union
			$scope.filter = {
				name: 'Union'
			};
			// keep track of tag that was chosen by user (used for r-click, delete tag/playlist)
			$scope.selectedTag = {};
		}

		function initWatchVars() {
			//watch variables
			var initializing = true;
			$scope.$watch('filter.name', function () {
				if (!initializing)
				{
					$scope.querySelectedTags();
					toastService.showMessage($scope.filter.name + "!");
				}
				else
				{
					initializing = false;
				}
			});
			$scope.$watch('tags', function (newVal, oldVal) { 
				if ($scope.tags.length < 1)
				{					
					filteredSongsService.filteredSongsDictionary = {};
					$scope.tagView = "tag-cloud";
				}
				else
				{
					$scope.querySelectedTags();
					$scope.tagView = "tag-results";
				}
			}, true);
		}

		function createCloud(playlists) {
			tagCloudService.tagCloud = [];
			for(var playlist in playlists) {
				tagCloudService.tagDictionary[playlists[playlist].id] = playlists[playlist];
				tagCloudService.tagCloud.push({ 
					text: playlists[playlist].name, 
					weight: playlists[playlist].total, 
					id: playlists[playlist].id,
					handlers: { click: function() {
							var index = angular.copy(playlist);
							return function() {
								$scope.tags.push({text: playlists[index].name, weight: playlists[index].total, id: playlists[index].id, selected: false});
								$scope.querySelectedTags();
							}
						}()
					}
				});
			}
			$scope.tagCloud = tagCloudService.tagCloud;
		}

		function handleParams(params) {
			var queryString = $location.search();

			if (queryString.filter) {
				var filterType = queryString.filter.toLowerCase();
				if (filterType == "union" || filterType == "intersection") {
					$scope.filter.name = sharedUtilService.capitalizeFirstLetter(filterType);
				}
			}
			
			if (queryString.ids) {
				var ids = queryString.ids.split(';');
				for (var i = 0; i < ids.length; i++) {
					var tag = tagCloudService.tagDictionary[ids[i]];
					if (tag) {
						$scope.tags.push({text: tag.name, weight: tag.total, id: tag.id, selected: false});
					}
				}
				if ($scope.tags.length > 0) {
					$scope.getPlaylistSongs([tag.id], $scope.filter.name);
				}
			} 
		}

		function initModule() {
			setupGrid();
			setupTagContextMenu();
			initVars();
			initWatchVars();

			// initial load
			$scope.tagView = "tag-cloud";
			$rootScope.$broadcast('loading.loading', {key:"getPlaylists", val: "Loading Playlists..."});
			tagService.getUserPlaylists().then(function(response){
				$rootScope.$broadcast('loading.loaded', {key:"getPlaylists"});
				createCloud(response.data);
				handleParams($routeParams);
			});
		}
	}
]);