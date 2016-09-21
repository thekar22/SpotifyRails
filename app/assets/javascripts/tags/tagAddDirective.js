angular.module('tagAddModule', ['sharedUtilModule'])
  .directive('tagAdd', ['sharedUtilService', '$rootScope', 'tagService', 'tagCloudService', 'toastService', 'selectedSongsService', '$mdDialog', 
  function (sharedUtilService, $rootScope, tagService, tagCloudService, toastService, selectedSongsService, $mdDialog) {
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
            // TODO
            console.log(response);
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