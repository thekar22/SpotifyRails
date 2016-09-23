angular.module('tagAddModule', ['sharedUtilModule'])
  .directive('tagAdd', ['sharedUtilService', '$rootScope', 'tagService', 'tagCloudService', 'toastService', 'selectedSongsService', '$mdDialog', '$location', 
  function (sharedUtilService, $rootScope, tagService, tagCloudService, toastService, selectedSongsService, $mdDialog, $location) {
  	function linkFunction($scope, elem, attrs) {
      $scope.addedTag = [];

  		$scope.onTagAdding = function($tag) {
        // restrict user input to one tag
        if($scope.addedTag.length > 0)
        {
          return false;
        }
  		}

      // auto complete drop down
  		$scope.filterTags = function($query) {
        // do not perform auto complete if tag already added
        if($scope.addedTag.length > 0)
        {
          $scope.text = '';
          return [];
        }
  			return tagCloudService.filterTags($query);
  		};

      $scope.addToTag = function() {        
        $rootScope.$broadcast('loading.loading', {key:"addTagToSongs", val: "Adding songs to tag..."});
        var songIds = selectedSongsService.extractSongIds(selectedSongsService.selectedSongs);
        if($scope.addedTag)
        {
          tagService.addTagToSelectedSongs($scope.addedTag[0].id, songIds).then(function(response){            
            $location.path('/tags/' + $scope.addedTag[0].id);
            $scope.closeDialog();
            $scope.addedTag = [];
            toastService.showMessage('Added songs to tag!');
            $rootScope.$broadcast('loading.loaded', {key:"addTagToSongs"});
          }, function(){
            toastService.showMessage('Something went horribly wrong!');
          });
        }
      }

      $scope.closeDialog = function() {
        $scope.addedTag = [];
        $mdDialog.hide();
      }
  	}

    return {
      restrict: 'E',
      replace: true,
      templateUrl: "tags/tagAddDirectiveView.html",
      link: linkFunction
    };
}]);