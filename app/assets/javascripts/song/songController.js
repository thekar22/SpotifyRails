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

	$scope.onTagAdding = function($tag) {

		$scope.text = "";

		if ($scope.tagCloud.some(function(e) { return e.text == $tag.text }))
		{
			console.log("existing tag");
			return $scope.addExistingTag($tag);
		}
		else
		{
			console.log("new tag");
			return $scope.addNewTag($tag);
		}		
	}

	$scope.onTagRemoving = function($tag) {
		// alert("removing");
	}

	$scope.onTagAdded = function($tag) {
		// notify user
		// alert("tagAdded");	
	}

	$scope.onTagRemoved = function($tag) {
		// notify user
		// alert("tagRemoved");	
	}

	$scope.addNewTag = function($tag) {
		return songService.addNewTag($tag, $scope.id).then(function(response){						
			$scope.tags.push({ text: "Jimmy", count: 1, id: 1 });
			
			return false;
		});
	}

	$scope.addExistingTag = function($tag) {
		return songService.addExistingTag($tag, $scope.id).then(function(response){						

			return true;
		});
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
					$scope.tagCloud[i] = { text: tags[i].name, count: tags[i].total, id: tags[i].id};
				}
			});
		}
	}
}
