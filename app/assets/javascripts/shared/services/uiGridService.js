angular.module('sharedUtilModule')
.factory('uiGridService', ['sharedUtilService', function (sharedUtilService) {

	var factory = {};

	factory.createGridOptions = function($scope, selectFunction) {
		var gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
		gridOptions.data = [];

		$scope.goToSelectedSong = function(row) {			
			sharedUtilService.redirect('#/song/' + row.entity['song_id']);
		};

		gridOptions.columnDefs = [
			{ 
				name: 'name', 
				displayName: 'Title',
				handleClick: $scope.goToSelectedSong,
				cellTemplate: '<span class="songCell" ng-click="col.colDef.handleClick(row)"> {{row.entity["name"]}} </span>'
			},
			{ 
				name: 'artist', 
				displayName: 'Artist',
				handleClick: $scope.goToSelectedSong,
				cellTemplate: '<span> {{row.entity["artist"]}} </span>'
			},
			{ name: 'song_id', visible: false}
		];

		gridOptions.onRegisterApi = function( gridApi ) {
			$scope.gridApi = gridApi;
			gridApi.selection.on.rowSelectionChanged($scope, selectFunction);
		};

		return gridOptions;
	}

	return factory;
}]);