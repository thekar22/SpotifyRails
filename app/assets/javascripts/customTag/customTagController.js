angular
	.module('customTagModule', ['ui.grid', 'ui.grid.selection', 'sharedUtilModule'])
	.controller('customTagController', ['$scope', '$http', '$rootScope', 'searchService', 'uiGridService', 'sharedUtilService', 'selectedSongsService', 'customTagService', 
		function customTagController($scope, $http, $rootScope, searchService, uiGridService, sharedUtilService, selectedSongsService, customTagService) {
		initModule();

		$scope.searchQuery = function($query) {
			$scope.showSearchResults = true;

			// perform search against query with spotify service
			$rootScope.$broadcast('loading.loading', {key:"searchQuery", val: "Loading"});
			searchService.searchQuery($query).then(function(response){
				$scope.searchedQuery = $query;
				$rootScope.$broadcast('loading.loaded', {key:"searchQuery"});
				var result = response.data;
				result = $scope.parseSongs(result);
				$scope.searchGridOptions.data = result;				
			})
		}

		$scope.parseSongs = function (spotifyList) {
			// iterate through each item in spotify song list
			// for each spotify song, create new object that has same fields (ones we care about) as db songs
			var songs = spotifyList.map(function(song) {
				return {name: song.name, artist: song.artists[0].name, song_id: song.id};
			});

			return songs;
		}

		$scope.onRemoveFromCustomTag = function(row) {			
			customTagService.removeFromCustomTag(row);
		};

		function setupSearchGrid()
		{
			$scope.searchGridOptions = uiGridService.createGridOptions($scope, function(row) {
				// if row clicked
			});

			$scope.searchMenuOptions = [
				[
					'Add selected songs to tag...', 
					function () {						
						selectedSongsService.onAddSelectedSongs($scope.searchGridOptions.gridApi.selection.getSelectedRows());
					},
					function () { // function to determine whether menu option should be enabled/disabled
						if ($scope.searchGridOptions.gridApi.selection.getSelectedRows().length > 0) {
							return true;
						}
						return false;
					}
				],
				[
					'Add selected songs to custom tag...', 
					function () {
						customTagService.onAddToCustomTag($scope.searchGridOptions.gridApi.selection.getSelectedRows());
					},
					function () { // function to determine whether menu option should be enabled/disabled
						if ($scope.searchGridOptions.gridApi.selection.getSelectedRows().length > 0) {
							return true;
						}
						return false;
					}
				]
			];
		}

		function setupCustomTagGrid()
		{			
			$scope.customTagGridOptions = uiGridService.createGridOptions($scope, function(row){
				// if row clicked
			});

			$scope.customTagGridOptions.columnDefs.push({ 
				name: 'Remove',
				cellTemplate: '<div ng-click="grid.appScope.onRemoveFromCustomTag(row)"> - </div>'
			});


			$scope.customMenuOptions = [
				[
					'Add selected songs to tag...', 
					function () {						
						selectedSongsService.onAddSelectedSongs($scope.customTagGridOptions.gridApi.selection.getSelectedRows());
					},
					function () { // function to determine whether menu option should be enabled/disabled
						if ($scope.customTagGridOptions.gridApi.selection.getSelectedRows().length > 0) {
							return true;
						}
						return false;
					}
				]
			];


			$scope.customTagGridOptions.data = customTagService.customSongs;
		}

		function initWatchVars()
		{
			$scope.$watch('customTagGridOptions.data', function (newVal, oldVal) {				
				if (customTagService.customSongs.length > 0)
				{
					$scope.customView = "custom-results";
				}
				else
				{
					$scope.customView = "";					
				}
			}, true);
		}

		function initVars()
		{
			$scope.searchedQuery = "";
			$scope.showSearchResults = false;
			$scope.customView = "";
		}

		function initModule(){
			setupSearchGrid();
			setupCustomTagGrid();
			$scope.query = {
				text: ''
			};
			initWatchVars();
		}
	}
]);
