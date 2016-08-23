angular
	.module('searchModule', ['searchService', 'ng-rails-csrf', 'ui.grid', 'ui.grid.selection', 'sharedUtilService', 'uiGridService'])
	.controller('searchController', ['$scope', 'searchService', '$http', 'sharedUtilService', 'uiGridService', '$rootScope', function searchController($scope, searchService, $http, sharedUtilService, uiGridService, $rootScope) {
		initModule();

		$scope.searchQuery = function($query) {
			// perform search against query with spotify service
			$rootScope.$broadcast('loading.loading', {key:"searchQuery", val: "Loading"});
			searchService.searchQuery($query).then(function(response){
				$rootScope.$broadcast('loading.loaded', {key:"searchQuery"});
				var result = response.data;							
				$scope.gridOptions.data = result;

				$scope.results = response.data;
			})	
		}

		function setupGrid()
		{ 
			$scope.gridOptions = uiGridService.createGridOptions($scope, 'id');
			$scope.gridOptions.columnDefs = [
				{ name: 'name', displayName: 'Title'},
				{ name: 'artists[0].name', displayName: 'Artist'},
				{ name: 'id', visible: false}
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

