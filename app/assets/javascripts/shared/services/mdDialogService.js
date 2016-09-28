angular.module('sharedUtilModule')
.factory('mdDialogService', ['$mdDialog', function ($mdDialog) {

	// make more generic if once used again (currently only used in tagController as dialog for creating tag and as confirm for deleting tag)
	var factory = {};
	factory.createDialog = function(type, params) {
		var confirm = {};
		if (type == "confirm") {
			confirm = $mdDialog.confirm()
			.title(params.title)
			.textContent(params.textContent)
			.ariaLabel(params.ariaLabel)
			.targetEvent(params.ev)
			.ok(params.ok)
			.cancel(params.cancel);
		}
		else if (type == "prompt") {
			confirm = $mdDialog.prompt()
			.title(params.title)
			.textContent(params.textContent)
			.placeholder(params.placeholder)
			.ariaLabel(params.ariaLabel)
			.initialValue(params.initialValue)
			.targetEvent(params.ev)
			.ok(params.ok)
			.cancel(params.cancel);
		}
		return confirm;
	}
	return factory;
}]);