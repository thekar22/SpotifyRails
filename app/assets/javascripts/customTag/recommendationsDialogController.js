angular
	.module('customTagModule')
	.controller('recommendationsDialogController', ['$scope', '$mdDialog', 'items',
		function recommendationsDialogController($scope, $mdDialog, items) {
				
		$scope.items = items;
		$scope.closeDialog = function() {
			$mdDialog.hide();
		}

		$scope.generate = function() {
			$scope.closeDialog();
		}
}]);