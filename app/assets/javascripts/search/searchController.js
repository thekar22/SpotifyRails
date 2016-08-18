angular
	.module('searchModule', ['searchService', 'ng-rails-csrf', 'ui.grid', 'ui.grid.selection', 'sharedUtilService', 'uiGridService'])
	.controller('searchController', ['$scope', 'searchService', '$http', 'sharedUtilService', 'uiGridService', function searchController($scope, searchService, $http, sharedUtilService, uiGridService) {
		initModule();

		$scope.searchQuery = function($query) {
			// perform search against query with spotify service

			$scope.loading = 'Getting Results...';
			searchService.searchQuery($query).then(function(response){
				$scope.loading = 'Results Loaded...';
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

