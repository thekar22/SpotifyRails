angular
  .module('songCardDirective', ['sharedUtilService'])
  .directive('song', ['sharedUtilService', function (sharedUtilService) {
    
    function linkFunction($scope, elem, attrs) {
      elem.bind('click', function() {
          sharedUtilService.redirect('#/song/' + $scope.song.song_id);
      });
    }

    return {
      restrict: 'E',
      scope: {
        song: '='
      },
      replace: true,
      templateUrl: "shared/songCard/songCardDirectiveView.html",
      link: linkFunction
    };
}]);