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

		$scope.openLeftMenu = function() {
			$mdSidenav('left').toggle();
		};	
			$scope.openRightMenu = function() {
			$mdSidenav('right').toggle();
		};
}]);