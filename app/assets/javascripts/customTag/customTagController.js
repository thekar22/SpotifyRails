angular
	.module('customTagModule', ['searchService', 'ui.grid', 'ui.grid.selection', 'uiGridService', 'sharedUtilService'])
	.controller('customTagController', ['$scope', '$http', '$rootScope', 'searchService', 'uiGridService', 'sharedUtilService', function customTagController($scope, $http, $rootScope, searchService, uiGridService, sharedUtilService) {
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
				cellTemplate: '<div class="songCell" ng-click="grid.appScope.addToSelectedSongs(row)"> + </div>'
			});
		}

		function setupCustomTagGrid()
		{ 
			$scope.selectedSongsGridOptions = uiGridService.createGridOptions($scope, function(row){
				// if row clicked
			});

			$scope.selectedSongsGridOptions.columnDefs.push({ 
				name: 'Remove', 
				cellTemplate: '<div class="songCell" ng-click="grid.appScope.removeFromSelectedSongs(row)"> - </div>'
			});

			if ($scope.selectedSongs.length > 0)
			{				
				$scope.selectedSongsGridOptions.data = $scope.selectedSongs;
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
