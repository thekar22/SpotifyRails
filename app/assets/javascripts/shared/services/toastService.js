angular.module('sharedUtilModule')
.factory('toastService', ['$mdToast', function($mdToast) {
	var factory = {};
	factory.showMessage = function(message)
	{
		$mdToast.show(
			$mdToast.simple()
				.textContent(message)
				.hideDelay(3000)
		);
	}

	return factory;
}]);