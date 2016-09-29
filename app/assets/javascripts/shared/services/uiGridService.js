angular.module('sharedUtilModule')
.factory('uiGridService', ['sharedUtilService', function (sharedUtilService) {

	var factory = {};

	factory.createGridOptions = function($scope) {
		var gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
		gridOptions.data = [];

		$scope.goToSelectedSong = function(row) {			
			sharedUtilService.redirect('/song/' + row.entity['song_id'], {});			
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
			gridOptions.gridApi = gridApi;
			gridOptions.mySelectedRows=gridOptions.gridApi.selection.getSelectedRows();			
		};

		gridOptions.rowHeight = 40;

		return gridOptions;
	}

	return factory;
}]);