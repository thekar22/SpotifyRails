angular
	.module('songModule', ['songService', 'tagService', 'ngTagsInput', 'sharedUtilModule'])
	.controller('songController', ['$scope', 'songService', 'songPlayingService', 'tagService', 'tagCloudService', 'toastService', '$http', '$routeParams', '$rootScope', '$sce', 'sharedUtilService', 
	function songController($scope, songService, songPlayingService, tagService, tagCloudService, toastService, $http, $routeParams, $rootScope, $sce, sharedUtilService) {
		initModule();

		$scope.filterTags = function($query) {			
			return tagCloudService.filterTags($query);
		};

		$scope.onTagAdding = function($tag) {

			$scope.text = "";
			
			// client side check to see if playlist already exists
			var match = tagCloudService.tagCloud.some(function(e) { return e.text == $tag.text });			
			if (match) {
				// check to make sure we are not adding a tag that already exists
				var tagAlreadyChosen = $scope.songTags.some(function(e) { return e.text == $tag.text });
				if (!tagAlreadyChosen) {
					return $scope.addExistingTag($tag);
				}
				return false;
			}
			else {
				return $scope.addNewTag($tag);
			}
		}		

		$scope.onTagRemoving = function($tag) {			
			window.event.stopPropagation();
			return $scope.removeTag($tag);
		}

		$scope.addNewTag = function($tag) {
			$rootScope.$broadcast('loading.loading', {key:"addNewTag", val: "Adding Tag..."});
			return tagService.addNewTag($tag.text, $scope.id).then(function(response){
				$rootScope.$broadcast('loading.loaded', {key:"addNewTag"});
				if (response) {					
					var tag = response.data;
					tagCloudService.tagCloud.push({ 
						text: tag.name, 
						weight: tag.total, 
						id: tag.playlist_id
					});
					$scope.songTags.push({ text: tag.name, weight: tag.total, id: tag.playlist_id });
					toastService.showMessage("New tag created!");
				}
				return false;
			});
		}

		$scope.addExistingTag = function($tag) {
			$rootScope.$broadcast('loading.loading', {key:"addExistingTag", val: "Adding Tag..."});
			return songService.addExistingTag($tag.id, $scope.id).then(function(response){
				$rootScope.$broadcast('loading.loaded', {key:"addExistingTag"});
				if (response)
				{
					var tag = response.data;					
					$scope.songTags.push({ text: tag.name, weight: tag.total, id: tag.playlist_id });
					toastService.showMessage("Tag added!");	
				}
				return false;
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
			sharedUtilService.redirect('/tags/', {ids:$tag.id});
		}

		$scope.createCloud = function (playlists)
		{
			tagCloudService.tagCloud = [];			
			for (var playlist in playlists) {
				tagCloudService.tagDictionary[playlists[playlist].id] = playlists[playlist];
				tagCloudService.tagCloud.push({ 
					text: playlists[playlist].name, 
					weight: playlists[playlist].total, 
					id: playlists[playlist].id
				});
			}
		}

		function initModule() {			
			// chosen tags
			$scope.songTags = [];
			$scope.id = $routeParams.id;
			songPlayingService.pushSongById($scope.id);
						
			if ($scope.id == 0) {
				// TODO	current song
				console.log("current song");
			}
			else
			{	
				$rootScope.$broadcast('loading.loading', {key:"getSong", val: "Loading Song..."});
				songService.getSong($scope.id).then(function(response) {
					$rootScope.$broadcast('loading.loaded', {key:"getSong"});
					$scope.song = response.data;
				});

				$rootScope.$broadcast('loading.loading', {key:"getCurrentTags", val: "Loading Tags... (Takes a while the first time)"});
				songService.getCurrentTags($scope.id).then(function(response) {
					$rootScope.$broadcast('loading.loaded', {key:"getCurrentTags"});
					var tags = response.data;

					for(var i = 0; i < tags.length; i++) {						
						$scope.songTags.push({ text: tags[i].name, weight: tags[i].total, id: tags[i].playlist_id });
					}
				});

				$rootScope.$broadcast('loading.loading', {key:"getPlaylists", val: "Loading Playlists..."});
				tagService.getUserPlaylists().then(function(response) {
					$rootScope.$broadcast('loading.loaded', {key:"getPlaylists"});
					$scope.createCloud(response.data);
				});

			}
		}
	}
]);