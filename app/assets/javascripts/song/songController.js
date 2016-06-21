angular
	.module('songModule', ['songService', 'tagService', 'ngTagsInput', 'ng-rails-csrf'])
	.controller('songController', ['$scope', 'songService', 'tagService', '$http', songController]);

function songController($scope, songService, tagService, $http)
{
	initModule();

	$scope.loadTags = function($query) {
		var tags = $scope.tagCloud;
		return tags.filter(function(tag) {
			return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
		});
	};

	$scope.onTagAdded = function($tag) {
		// add song to added tag/playlist
	}

	$scope.onTagRemoved = function($tag) {
		// remove song from removed tag/playlist
	}

	$scope.addNewTag = function($tag) {
		// create new tag/playlist and add song to this playlist
	}

	function initModule(){
		// chosen tags
		$scope.tags = [];

		if ($scope.tagCloud.length < 1) {
			$scope.loading = 'Loading Tags...';
			tagService.getUserPlaylists().then(function(response){
				$scope.loading = '';
				var playlists = response.data;

				for(var i = 0; i < playlists.length; i++){
					$scope.tagCloud[i] = { text: playlists[i].name, count: playlists[i].total, id: playlists[i].id};
				}
			});
		}
	}
}
