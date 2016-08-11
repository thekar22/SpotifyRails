angular
	.module('navigationModule', [])
	.controller('navigationController', ['$scope', '$mdSidenav', function tagController($scope, $mdSidenav) {
		$scope.openLeftMenu = function() {
			$mdSidenav('left').toggle();
		};	
			$scope.openRightMenu = function() {
			$mdSidenav('right').toggle();
		};	
}]);