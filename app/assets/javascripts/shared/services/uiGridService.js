angular.module('sharedUtilModule')
.factory('uiGridService', ['sharedUtilService', 'songPlayingService', function (sharedUtilService, songPlayingService) {

	var factory = {};

	factory.createGridOptions = function($scope) {
		var gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
		gridOptions.data = [];

		$scope.goToSelectedSong = function(row) {
			sharedUtilService.redirect('/song/' + row.entity['song_id'], {});
		};

		$scope.playSelectedSong = function(row) {
			songPlayingService.pushSongById(row.entity.song_id)
		};

		gridOptions.columnDefs = [
			{ 
				name: 'Play', 
				enableColumnMenu: false,
				enableSorting: false,
				width: 35,
				displayName: ' ',
				handleClick: $scope.playSelectedSong,
				cellTemplate: '<span class="gridPlayButton" ng-click="col.colDef.handleClick(row)"> &#9658; </span>'
			},
			{ 
				name: 'name', 
				displayName: 'Title',
				handleClick: $scope.goToSelectedSong,
				cellTemplate: '<span class="songCell" ng-click="col.colDef.handleClick(row)"> {{row.entity["name"]}} </span>'
			},
			{ 
				name: 'artist', 
				displayName: 'Artist',
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