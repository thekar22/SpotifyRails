angular
	.module('sandboxModule', ['ui.grid', 'ui.grid.selection', 'sharedUtilModule'])
	.controller('sandboxController', ['$scope', '$http', '$rootScope', 'searchService', 'uiGridService', '$mdDialog', 'mdDialogService', 'sharedUtilService', 'selectedSongsService', 'sandboxService', 
		function sandboxController($scope, $http, $rootScope, searchService, uiGridService, $mdDialog, mdDialogService, sharedUtilService, selectedSongsService, sandboxService) {
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

		$scope.onRemoveFromSandbox = function(row) {
			sandboxService.removeFromSandbox(row);
		};

		function setupSearchGrid()
		{
			$scope.searchGridOptions = uiGridService.createGridOptions($scope, function(row) {
				// if row clicked
			});

			$scope.searchMenuOptions = [
				[
					'Add selected songs...', 
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
					'Add selected songs to sandbox...', 
					function () {
						sandboxService.onAddToSandbox($scope.searchGridOptions.gridApi.selection.getSelectedRows());
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

		$scope.generateRecommendations = function(ev) {
			var parentEl = angular.element(document.body);
			$mdDialog.show({
				parent: parentEl,
				targetEvent: ev,
				templateUrl: 'sandbox/recommendationsDialogView.html',
				locals: {
					sandboxSongs: sandboxService.sandboxSongs
				},
				controller: 'recommendationsDialogController'
			});
		}

		function setupSandboxGrid()
		{
			$scope.sandboxGridOptions = uiGridService.createGridOptions($scope, function(row){
				// if row clicked
			});

			$scope.sandboxGridOptions.columnDefs.push({ 
				name: 'Remove',
				cellTemplate: '<div ng-click="grid.appScope.onRemoveFromSandbox(row)"> - </div>'
			});


			$scope.sandboxMenuOptions = [
				[
					'Add selected songs...', 
					function () {
						selectedSongsService.onAddSelectedSongs($scope.sandboxGridOptions.gridApi.selection.getSelectedRows());
					},
					function () { // function to determine whether menu option should be enabled/disabled
						if ($scope.sandboxGridOptions.gridApi.selection.getSelectedRows().length > 0) {
							return true;
						}
						return false;
					}
				]
			];


			$scope.sandboxGridOptions.data = sandboxService.sandboxSongs;
		}

		function initWatchVars()
		{
			$scope.$watch('sandboxGridOptions.data', function (newVal, oldVal) {				
				if (sandboxService.sandboxSongs.length > 0)
				{
					$scope.sandboxView = "sandbox-results";
				}
				else
				{
					$scope.sandboxView = "";
				}
			}, true);
		}

		function initVars()
		{
			$scope.searchedQuery = "";
			$scope.showSearchResults = false;
			$scope.sandboxView = "";
		}

		function initModule(){
			setupSearchGrid();
			setupSandboxGrid();
			$scope.query = {
				text: ''
			};
			initWatchVars();
		}
	}
]);
