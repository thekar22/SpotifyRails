angular
	.module('playlistModule', ['tagService', 'ngTagsInput', 'ng-rails-csrf'])
	.controller('tagController', ['$scope', 'tagService', '$http', tagController]);

function tagController($scope, tagService, $http)
{
	$scope.loading = 'Loading Playlists...';

	//once playlists are retrieived, store them in dictionary
	var lookup = {};
	$scope.tagCloud = [];
	//array containing selected playlists
	$scope.selected = {};
	//songs
	$scope.songs = {};

	tagService.getUserPlaylists().then(function(response){
		  $scope.loading = '';
		  $scope.playlists = response.data;

		  //put playlists in dictionary lookup object
		  for(var i = 0; i < $scope.playlists.length; i++){
		  	lookup[$scope.playlists[i].id] = $scope.playlists[i];
		  	$scope.tagCloud[i] = { text: $scope.playlists[i].name, count: $scope.playlists[i].total, id: $scope.playlists[i].id};
		  }
	});

	$scope.tags = [];

	$scope.loadTags = function($query) {
		var tags = $scope.tagCloud;
		return tags.filter(function(tag) {
			return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
		});
	};

	$scope.onTagAdded = function($tag) {
		console.log("add songs related to tag");
		// retrieve partial result from last computation
		// perform union/intersection against new list
	}

	$scope.onTagRemoved = function($tag) {
		console.log("remove songs related to tag");
		// get all lists that are still there
		// perform union/intersection based on checkbox
	}

	$scope.setSongIds = function(ids) {
		$scope.songIds = ids;
	};

}