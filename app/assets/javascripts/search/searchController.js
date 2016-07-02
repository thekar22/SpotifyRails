angular
	.module('searchModule', ['searchService', 'ng-rails-csrf'])
	.controller('searchController', ['$scope', 'searchService', '$http', searchController]);

function searchController($scope, searchService, $http)
{
	initModule();

	$scope.searchQuery = function($query) {
		// perform search against query with spotify service

		$scope.loading = 'Getting Results...';
		searchService.searchQuery($query).then(function(response){
			$scope.loading = 'Results Loaded...';
			var result = response.data;
			$scope.results = response.data;
		})	
	}

	function initModule(){
		$scope.query = {
			text: ''
		};
	}
}