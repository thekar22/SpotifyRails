angular.module('sharedUtilModule')
.factory('loadingService', ['$rootScope', function($rootScope) {
	var factory = {};
	factory.broadcast = function(channel, loadingKeyVal) {
		$rootScope.$broadcast(channel, loadingKeyVal);
	}

	return factory;
}]);