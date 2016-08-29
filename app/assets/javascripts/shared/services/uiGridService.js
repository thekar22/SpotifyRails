angular.module('uiGridService', ['sharedUtilService'])
.factory('uiGridService', ['sharedUtilService', function (sharedUtilService) {

	var factory = {};

	factory.createGridOptions = function($scope, selectFunction) {
		var gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
		gridOptions.multiSelect = false;
		gridOptions.modifierKeysToMultiSelect = false;
		gridOptions.noUnselect = true;
		gridOptions.data = [];

		gridOptions.columnDefs = [
			{ name: 'name', displayName: 'Title'},
			{ name: 'artist', displayName: 'Artist'},
			{ name: 'song_id', visible: false},			
		];

		gridOptions.onRegisterApi = function( gridApi ) {
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, selectFunction);
		};

		return gridOptions;
	}

	return factory;
}]);