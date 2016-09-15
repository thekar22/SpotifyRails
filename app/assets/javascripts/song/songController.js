angular
	.module('songModule', ['songService', 'tagService', 'ngTagsInput', 'sharedUtilService'])
	.controller('songController', ['$scope', 'songService', 'tagService', '$http', '$routeParams', '$rootScope', 'sharedUtilService', function songController($scope, songService, tagService, $http, $routeParams, $rootScope, sharedUtilService) {
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
			$rootScope.$broadcast('loading.loading', {key:"addNewTag", val: "Adding Tag..."});
			return tagService.addNewTag($tag.text, $scope.id).then(function(response){
				$rootScope.$broadcast('loading.loaded', {key:"addNewTag"});
				var tag = response.data
				$scope.tags.push({ text: tag.name, weight: tag.total, id: tag.playlist_id });
				$scope.tagCloud.push({ 
					text: tag.name, 
					weight: tag.total, 
					id: tag.playlist_id,
					handlers: { 
						click: function() {
							return function() {
								$scope.tags.push({text: tag.name, weight: tag.total, id: tag.playlist_id});
								$scope.queryResults();
							}
						}()
					}
				});
				return false;
			});
		}

		$scope.addExistingTag = function($tag) {
			$rootScope.$broadcast('loading.loading', {key:"addExistingTag", val: "Adding Tag..."});
			return songService.addExistingTag($tag.id, $scope.id).then(function(response){
				$rootScope.$broadcast('loading.loaded', {key:"addExistingTag"});
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
			$rootScope.$broadcast('loading.loading', {key:"removeTag", val: "Removing Tag..."});
			return songService.removeTag($tag.id, $scope.id).then(function(response){
				$rootScope.$broadcast('loading.loaded', {key:"removeTag"});			
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

		$scope.onTagClicked = function ($tag) {			
			sharedUtilService.redirect('#/tagCloud/' + $tag.id);
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
				$rootScope.$broadcast('loading.loading', {key:"getSong", val: "Loading Song..."});
				songService.getSong($scope.id).then(function(response){					
					$rootScope.$broadcast('loading.loaded', {key:"getSong"});
					$scope.song = response.data;
				});

				$rootScope.$broadcast('loading.loading', {key:"getCurrentTags", val: "Loading Tags... (Takes a while the first time)"});
				songService.getCurrentTags($scope.id).then(function(response) {
					$rootScope.$broadcast('loading.loaded', {key:"getCurrentTags"});
					var tags = response.data;

					for(var i = 0; i < tags.length; i++) {
						$scope.tags.push({ text: tags[i].name, weight: tags[i].total, id: tags[i].playlist_id });
					}
				});
			}
		}
	}
]);