angular
	.module('songModule', ['songService', 'tagService', 'ngTagsInput', 'ng-rails-csrf'])
	.controller('songController', ['$scope', 'songService', 'tagService', '$http', '$routeParams', songController]);

function songController($scope, songService, tagService, $http, $routeParams)
{
	initModule();

	$scope.loadTags = function($query) {
		return $scope.tagCloud.filter(function(tag) {
			return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
		});
	};

	$scope.onTagAdded = function($tag) {
		// notify user
	}

	$scope.onTagRemoved = function($tag) {
		// notify user
	}

	$scope.addNewTag = function($tag) {
		// create new tag/playlist and add song to this playlist
		// check if new tag is part of current list
		// if not
		// 	confirm with user to add new tag
		// add tag service
	}

	$scope.removeTag = function($tag) {
		// remove tag service
	}

	function initModule() {
		// chosen tags
		$scope.tags = [];
		$scope.id = $routeParams.id;

		if ($scope.id == 0) {
			// TODO	current song
			console.log("current song");
		}
		else
		{	
			songService.getSong($scope.id).then(function(response){
				$scope.song = response.data;
			});

			songService.getCurrentTags($scope.id).then(function(response){
				var tags = response.data;

				for(var i = 0; i < tags.length; i++) {
					$scope.tags.push({ text: tags[i].name, count: tags[i].total, id: tags[i].playlist_id });
				}
			});
		}
		
		if ($scope.tagCloud.length < 1) {
			$scope.loading.text = 'Loading Tags...';
			tagService.getUserPlaylists().then(function(response){
				$scope.loading.text = '';
				var tags = response.data;

				for(var i = 0; i < tags.length; i++){
					$scope.tagCloud[i] = { text: tags[i].name, count: tags[i].total, id: tags[i].playlist_id};
				}
			});
		}
	}
}
