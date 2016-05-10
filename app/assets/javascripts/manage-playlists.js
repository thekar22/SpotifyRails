var app = angular.module('MusicApp', ['playlistService', 'testService']);

app.controller('playlistController', ['$scope', 'playlistService', 'testService', function($scope, playlistService, testService){
  $scope.loading = 'Loading Playlists...';

  playlistService.getUserPlaylists().then(function(response){
  	  $scope.loading = '';
  	  $scope.playlists = response.data;
  });

}]);