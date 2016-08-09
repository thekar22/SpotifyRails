angular
	.module('songModule', ['songService', 'tagService', 'ngTagsInput', 'ng-rails-csrf'])
	.controller('songController', ['$scope', 'songService', 'tagService', '$http', '$routeParams', function songController($scope, songService, tagService, $http, $routeParams) {
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
				return $scope.addExistingTag($tag);
			}
			else
			{
				return $scope.addNewTag($tag);
			}		
		}

		$scope.onTagRemoving = function($tag) {
			return $scope.removeTag($tag);
		}

		$scope.addNewTag = function($tag) {
			return songService.addNewTag($tag.text, $scope.id).then(function(response){		
				var tag = response.data
				$scope.tags.push({ text: tag.name, count: tag.total, id: tag.id });	
				return false;
			});
		}

		$scope.addExistingTag = function($tag) {
			return songService.addExistingTag($tag.id, $scope.id).then(function(response){						
				if (response)
				{
					return true;
				}
				else
				{
					return false
				}
			});
		}

		$scope.removeTag = function($tag) {
			return songService.removeTag($tag.id, $scope.id).then(function(response){						
				if (response)
				{
					return true;
				}
				else
				{
					return false
				}
			});
		}

		$scope.onTagAdded = function($tag) {
			// notify user
		}

		$scope.onTagRemoved = function($tag) {
			// notify user
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
		}
	}
]);