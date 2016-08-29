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
				$scope.searchGridOptions.data = result;

				$scope.results = response.data;
			})
		}

		function setupGrid()
		{ 
			$scope.searchGridOptions = uiGridService.createGridOptions($scope, function(row){
				// sharedUtilService.redirect('#/song/' + row.entity['id']);
			});
			$scope.searchGridOptions.columnDefs = [
				{ name: 'name', displayName: 'Title'},
				{ name: 'artists[0].name', displayName: 'Artist'},
				{ name: 'id', visible: false},
				{ name: 'Add'}
			];

			$scope.selectedSongsGridOptions = uiGridService.createGridOptions($scope, function(row){
				// sharedUtilService.redirect('#/song/' + row.entity['id']);
			});
			$scope.selectedSongsGridOptions.columnDefs = [
				{ name: 'name', displayName: 'Title'},
				{ name: 'artists[0].name', displayName: 'Artist'},
				{ name: 'id', visible: false},
				{ name: 'Delete'}
			];
		}

		function initModule(){
			setupGrid();
			$scope.query = {
				text: ''
			};
		}
	}
]);
