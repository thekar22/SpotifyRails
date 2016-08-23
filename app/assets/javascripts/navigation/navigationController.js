angular
	.module('navigationModule', [])
	.controller('navigationController', ['$scope', '$mdSidenav', '$location', function tagController($scope, $mdSidenav, $location) {
		
		$scope.$on('$locationChangeStart', function(event) {
			if ($location.path() !== "/")
			{
				$scope.navView = "other-view";
			}
			else
			{
				$scope.navView = "tag-view";
			}
		});

		$scope.loadingItems = {};
		$scope.dataLoading = false;

		$scope.$on('loading.loading', function (event, arg) { 			
			$scope.loadingItems[arg.key] = arg.val;
			$scope.dataLoading = true;
		});

		$scope.$on('loading.loaded', function (event, arg) { 			
			if ($scope.loadingItems[arg.key])
			{
				delete $scope.loadingItems[arg.key]
			}
			if (Object.keys($scope.loadingItems).length == 0) {
				$scope.dataLoading = false;
			}
		});

		$scope.openLeftMenu = function() {
			$mdSidenav('left').toggle();
		};	
			$scope.openRightMenu = function() {
			$mdSidenav('right').toggle();
		};
}]);