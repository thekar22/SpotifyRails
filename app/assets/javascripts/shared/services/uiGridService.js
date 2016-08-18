angular.module('uiGridService', ['sharedUtilService'])
.factory('uiGridService', ['sharedUtilService', function (sharedUtilService) {

	var factory = {};

	factory.createGridOptions = function($scope, redirectId) {
		var gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
		gridOptions.multiSelect = false;
		gridOptions.modifierKeysToMultiSelect = false;
		gridOptions.noUnselect = true;
		gridOptions.data = [];
		gridOptions.onRegisterApi = function( gridApi ) {
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, function(row){
				sharedUtilService.redirect('#/song/' + row.entity[redirectId]);
			});
		};

		return gridOptions;
	}

	return factory;
}]);