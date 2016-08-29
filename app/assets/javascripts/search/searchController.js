angular
	.module('searchModule', ['searchService', 'ui.grid', 'ui.grid.selection', 'uiGridService', 'sharedUtilService'])
	.controller('searchController', ['$scope', 'searchService', '$http', 'uiGridService', '$rootScope', 'sharedUtilService', function searchController($scope, searchService, $http, uiGridService, $rootScope, sharedUtilService) {
		initModule();

		$scope.searchQuery = function($query) {
			// perform search against query with spotify service
			$rootScope.$broadcast('loading.loading', {key:"searchQuery", val: "Loading"});
			searchService.searchQuery($query).then(function(response){
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

		$scope.addToSelectedSongs = function(row) { 
			$scope.selectedSongsGridOptions.data.push(row.entity);
		};

		$scope.removeFromSelectedSongs = function(row) {
			var index = $scope.selectedSongsGridOptions.data.indexOf(row.entity);
			$scope.selectedSongsGridOptions.data.splice(index, 1);
		};

		function setupSearchGrid()
		{
			$scope.searchGridOptions = uiGridService.createGridOptions($scope, function(row){
				// if row clicked
			});
			$scope.searchGridOptions.columnDefs.push({ 
				name: 'Add', 
				cellTemplate: '<button class="btn primary" ng-click="grid.appScope.addToSelectedSongs(row)"> + </button>'
			});
		}

		function setupCustomTagGrid()
		{ 
			$scope.selectedSongsGridOptions = uiGridService.createGridOptions($scope, function(row){
				// if row clicked
			});

			$scope.selectedSongsGridOptions.columnDefs.push({ 
				name: 'Remove', 
				cellTemplate: '<button class="btn primary" ng-click="grid.appScope.removeFromSelectedSongs(row)"> - </button>'
			});

			if ($scope.gridOptions.data.length > 0)
			{
				$scope.selectedSongsGridOptions.data = [];
				$scope.selectedSongsGridOptions.data = $scope.gridOptions.data;				
			}
			else
			{
				$scope.selectedSongsGridOptions.data = []
			}
		}

		function initModule(){
			setupSearchGrid();
			setupCustomTagGrid();
			$scope.query = {
				text: ''
			};
		}

	}
]);
