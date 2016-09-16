angular.module('sharedUtilModule')
.factory('mdConfirmService', ['$mdDialog', function ($mdDialog) {

	// make generic if once used again (currently only used in tagController for creating new tag)
	var factory = {};
	factory.createConfirmDialog = function(ev) {
		var confirm = $mdDialog.prompt()
				.title('Create New Tag')
				.textContent('New tags are created as playlists in Spotify')
				.placeholder('Type here')
				.ariaLabel('Tagname')
				.initialValue('Your New Tag')
				.targetEvent(ev)
				.ok('Create!')
				.cancel('Cancel');
		return confirm;
	}

	return factory;
}]);