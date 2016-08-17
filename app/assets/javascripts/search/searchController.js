angular
	.module('searchModule', ['searchService', 'ng-rails-csrf', 'ui.grid', 'ui.grid.selection', 'sharedUtilService'])
	.controller('searchController', ['$scope', 'searchService', '$http', 'sharedUtilService', function searchController($scope, searchService, $http, sharedUtilService) {
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
		{ //TODO share code with tag view
			$scope.gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
			$scope.gridOptions.columnDefs = [
				{ name: 'name', displayName: 'Title'},
				{ name: 'artists[0].name', displayName: 'Artist'},
				{ name: 'id'}
			];
			$scope.gridOptions.multiSelect = false;
			$scope.gridOptions.modifierKeysToMultiSelect = false;
			$scope.gridOptions.noUnselect = true;
			$scope.gridOptions.data = [];
			$scope.gridOptions.onRegisterApi = function( gridApi ) {
				$scope.gridApi = gridApi;
				gridApi.selection.on.rowSelectionChanged($scope, function(row){
					console.log(row.entity.song_id);
					sharedUtilService.redirect('#/song/' + row.entity.id);
					//Do something when a row is selected
				});
			};
		}

		function initModule(){
			setupGrid();
			$scope.query = {
				text: ''
			};
		}
	}
]);

